import api from './api';

const ORDERS_KEY = 'petzone_orders';

export const orderService = {
  // Create order
  async createOrder(orderData) {
    try {
      const response = await api.post('/orders', orderData);
      return { 
        success: true, 
        order: response.data.order || response.data, 
        orderId: response.data.orderId || (response.data.order && response.data.order._id),
        isDemo: false 
      };
    } catch (error) {
      if (error.isNetworkError || error.status === 404) {
        console.warn('Backend API unavailable. Saving order via local demo order storage.');
        
        const demoOrderId = 'PZ-ORD-' + Math.floor(100000 + Math.random() * 900000);
        
        const newOrder = {
          _id: demoOrderId,
          id: demoOrderId,
          orderId: demoOrderId,
          items: orderData.items,
          shippingAddress: orderData.shippingAddress,
          paymentMethod: orderData.paymentMethod || 'Cash on Delivery',
          subtotal: orderData.subtotal,
          deliveryFee: orderData.deliveryFee || 0,
          totalAmount: orderData.totalAmount,
          status: 'Placed',
          createdAt: new Date().toISOString(),
          estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })
        };

        // Save order in demo orders list
        const existingOrdersStr = localStorage.getItem(ORDERS_KEY);
        const existingOrders = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
        const updatedOrders = [newOrder, ...existingOrders];
        localStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders));

        return {
          success: true,
          order: newOrder,
          orderId: demoOrderId,
          isDemo: true,
          notice: 'Order placed successfully (Stored locally in Demo Mode).'
        };
      }
      throw error;
    }
  },

  // Get current user's orders
  async getMyOrders() {
    try {
      const response = await api.get('/orders/my-orders');
      return { orders: response.data.orders || response.data, isDemo: false };
    } catch (error) {
      if (error.isNetworkError || error.status === 404) {
        const storedStr = localStorage.getItem(ORDERS_KEY);
        const orders = storedStr ? JSON.parse(storedStr) : [];
        return { orders, isDemo: true };
      }
      throw error;
    }
  },

  // Get order by ID
  async getOrderById(id) {
    try {
      const response = await api.get(`/orders/${id}`);
      return { order: response.data.order || response.data, isDemo: false };
    } catch (error) {
      if (error.isNetworkError || error.status === 404) {
        const storedStr = localStorage.getItem(ORDERS_KEY);
        const orders = storedStr ? JSON.parse(storedStr) : [];
        const found = orders.find(o => o.id === id || o.orderId === id || o._id === id);
        if (found) {
          return { order: found, isDemo: true };
        }
        throw { message: `Order #${id} not found.` };
      }
      throw error;
    }
  }
};
