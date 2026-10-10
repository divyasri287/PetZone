const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');

// ─── GET /api/products ───────────────────────────────────────────────────────
// Public: List products with optional search, category, sort, pagination
router.get('/', async (req, res) => {
  try {
    const { search, category, sort, minPrice, maxPrice, rating, page = 1, limit = 50 } = req.query;

    const filter = {};

    // Category filter
    if (category && category !== 'all') {
      // Flexible match for 'dog-food' vs 'Dog Food'
      const sanitizedCategory = category.trim().replace(/-/g, '[ -]?');
      filter.category = { $regex: new RegExp(`^${sanitizedCategory}$`, 'i') };
    }

    // Full-text search
    if (search && search.trim()) {
      filter.$text = { $search: search.trim() };
    }

    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Rating filter
    if (rating) {
      filter.rating = { $gte: Number(rating) };
    }

    // Sorting
    let sortOption = {};
    switch (sort) {
      case 'price-low':  sortOption = { price: 1 }; break;
      case 'price-high': sortOption = { price: -1 }; break;
      case 'rating':     sortOption = { rating: -1 }; break;
      case 'discount':   sortOption = { discount: -1 }; break;
      case 'newest':     sortOption = { createdAt: -1 }; break;
      default:           sortOption = { isFeatured: -1, rating: -1 }; break;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    return res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    console.error('Get products error:', error);
    return res.status(500).json({ message: 'Failed to fetch products.' });
  }
});

// ─── GET /api/products/categories ───────────────────────────────────────────
// Public: Return list of available categories with counts
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const categoryList = [
      { id: 'dog-food', name: 'Dog Food', description: 'Nutrient-packed dry kibble, wet meals & raw nutrition' },
      { id: 'cat-food', name: 'Cat Food', description: 'Delicious canned gravy, dry morsels & feline treats' },
      { id: 'toys', name: 'Toys', description: 'Chew toys, laser teasers, balls & puzzle games' },
      { id: 'accessories', name: 'Accessories', description: 'Collars, leashes, harnesses, bowls & cozy beds' },
      { id: 'grooming', name: 'Grooming', description: 'Organic shampoos, slicker brushes, nail clippers & wipes' },
    ].map((cat) => {
      const found = categories.find((c) => c._id && c._id.toLowerCase().replace(/\s+/g, '-') === cat.id);
      return { ...cat, itemCount: found ? `${found.count}+ Products` : '0 Products' };
    });

    return res.json(categoryList);
  } catch (error) {
    console.error('Get categories error:', error);
    return res.status(500).json({ message: 'Failed to fetch categories.' });
  }
});

// ─── GET /api/products/:id ───────────────────────────────────────────────────
// Public: Get single product by MongoDB ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    return res.json({ product });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Product not found.' });
    }
    console.error('Get product error:', error);
    return res.status(500).json({ message: 'Failed to fetch product details.' });
  }
});

// ─── POST /api/products ─── Admin only ──────────────────────────────────────
router.post(
  '/',
  protect,
  adminOnly,
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
    body('category').notEmpty().withMessage('Category is required').isIn(['Dog Food', 'Cat Food', 'Toys', 'Accessories', 'Grooming']).withMessage('Invalid category'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    body('image').notEmpty().withMessage('Product image URL is required'),
  ],
  validate,
  async (req, res) => {
    try {
      const product = await Product.create(req.body);
      return res.status(201).json({ message: 'Product created successfully.', product });
    } catch (error) {
      console.error('Create product error:', error);
      return res.status(500).json({ message: 'Failed to create product.' });
    }
  }
);

// ─── PUT /api/products/:id ─── Admin only ───────────────────────────────────
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    // Prevent changing _id
    delete req.body._id;

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    return res.json({ message: 'Product updated successfully.', product });
  } catch (error) {
    if (error.name === 'CastError') return res.status(404).json({ message: 'Product not found.' });
    console.error('Update product error:', error);
    return res.status(500).json({ message: 'Failed to update product.' });
  }
});

// ─── DELETE /api/products/:id ─── Admin only ────────────────────────────────
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    return res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    if (error.name === 'CastError') return res.status(404).json({ message: 'Product not found.' });
    console.error('Delete product error:', error);
    return res.status(500).json({ message: 'Failed to delete product.' });
  }
});

module.exports = router;
