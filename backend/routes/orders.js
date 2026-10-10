const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');

// ─── POST /api/orders ────────────────────────────────────────────────────────
// Authenticated: Create an order
// Prices are ALWAYS recalculated from DB; client prices are IGNORED
router.post(
  '/',
  protect,
  [
    body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('items.*.product').notEmpty().withMessage('Each item must have a product ID'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('shippingAddress.fullName').notEmpty().withMessage('Full name is required'),
    body('shippingAddress.phone').notEmpty().withMessage('Phone number is required'),
    body('shippingAddress.address').notEmpty().withMessage('Address is required'),
    body('shippingAddress.city').notEmpty().withMessage('City is required'),
    body('shippingAddress.state').notEmpty().withMessage('State is required'),
    body('shippingAddress.pincode').notEmpty().withMessage('Pincode is required'),
    body('paymentMethod').optional().isIn(['Cash on Delivery', 'UPI', 'Card', 'Net Banking']).withMessage('Invalid payment method'),
  ],
  validate,
  async (req, res) => {
    try {
      const { items, shippingAddress, paymentMethod = 'Cash on Delivery' } = req.body;

      // Fetch all products from DB to lock prices and validate stock
      const productIds = items.map((i) => i.product);
      const dbProducts = await Product.find({ _id: { $in: productIds } });

      if (dbProducts.length !== productIds.length) {
        return res.status(400).json({ message: 'One or more products were not found. Please refresh your cart.' });
      }

      // Build order items using server-side prices
      const orderItems = [];
      for (const item of items) {
        const dbProduct = dbProducts.find((p) => String(p._id) === String(item.product));

        if (!dbProduct) {
          return res.status(400).json({ message: `Product not found: ${item.product}` });
        }

        if (dbProduct.stock < item.quantity) {
          return res.status(400).json({
            message: `"${dbProduct.name}" only has ${dbProduct.stock} item(s) in stock. You requested ${item.quantity}.`,
          });
        }

        orderItems.push({
          product: dbProduct._id,
          name: dbProduct.name,
          image: dbProduct.image,
          price: dbProduct.price,        // ← Server-calculated price
          quantity: item.quantity,
        });
      }

      // Server-side totals calculation
      const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const deliveryFee = subtotal >= 999 ? 0 : 80;  // Free delivery above ₹999
      const totalAmount = subtotal + deliveryFee;

      // Calculate estimated delivery (3 business days)
      const estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      const order = await Order.create({
        user: req.user._id,
        items: orderItems,
        shippingAddress,
        paymentMethod,
        subtotal,
        deliveryFee,
        totalAmount,
        estimatedDelivery,
      });

      // Decrement stock for each product
      for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
      }

      return res.status(201).json({
        message: 'Order placed successfully!',
        order,
        orderId: order.orderId,
      });
    } catch (error) {
      console.error('Create order error:', error);
      return res.status(500).json({ message: 'Failed to place order. Please try again.' });
    }
  }
);

// ─── GET /api/orders/my-orders ───────────────────────────────────────────────
// Authenticated: Get current user's orders
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name image');

    return res.json({ orders });
  } catch (error) {
    console.error('Get my orders error:', error);
    return res.status(500).json({ message: 'Failed to fetch your orders.' });
  }
});

// ─── GET /api/orders/admin ───────────────────────────────────────────────────
// Admin only: Get all orders
router.get('/admin', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = status ? { status } : {};
    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('user', 'name email phone')
        .populate('items.product', 'name image'),
      Order.countDocuments(filter),
    ]);

    return res.json({ orders, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    console.error('Admin get orders error:', error);
    return res.status(500).json({ message: 'Failed to fetch orders.' });
  }
});

// ─── GET /api/orders/:id ─────────────────────────────────────────────────────
// Authenticated: Get specific order by MongoDB ID or orderId (customer must own it)
router.get('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    // Try to find by _id or orderId
    let order = await Order.findOne({
      $or: [
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
        { orderId: id },
      ],
    }).populate('items.product', 'name image');

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Customer can only see their own orders; admins can see all
    if (req.user.role !== 'admin' && String(order.user) !== String(req.user._id)) {
      return res.status(403).json({ message: 'You do not have permission to view this order.' });
    }

    return res.json({ order });
  } catch (error) {
    if (error.name === 'CastError') return res.status(404).json({ message: 'Order not found.' });
    console.error('Get order error:', error);
    return res.status(500).json({ message: 'Failed to fetch order.' });
  }
});

// ─── PUT /api/orders/:id/status ─── Admin only ──────────────────────────────
router.put(
  '/:id/status',
  protect,
  adminOnly,
  [
    body('status')
      .notEmpty()
      .withMessage('Status is required')
      .isIn(['Placed', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'])
      .withMessage('Invalid order status'),
  ],
  validate,
  async (req, res) => {
    try {
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true, runValidators: true }
      );
      if (!order) return res.status(404).json({ message: 'Order not found.' });
      return res.json({ message: 'Order status updated.', order });
    } catch (error) {
      if (error.name === 'CastError') return res.status(404).json({ message: 'Order not found.' });
      console.error('Update order status error:', error);
      return res.status(500).json({ message: 'Failed to update order status.' });
    }
  }
);

module.exports = router;
