import React, { useState, useEffect } from 'react';
import { Package, RefreshCw } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { orderService } from '../services/orderService';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await orderService.getMyOrders();
      setOrders(res.orders || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <LoadingSpinner text="Loading orders..." />;

  if (error) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center space-y-3">
        <p className="text-xs font-bold text-red-600">{error}</p>
        <button onClick={fetchOrders} className="px-4 py-2 bg-[#E08838] text-white text-xs font-bold rounded-full">
          <RefreshCw className="w-3.5 h-3.5 inline mr-1" /> Retry
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12">
        <EmptyState
          icon="orders"
          title="No Orders Yet"
          description="You haven't placed any orders with PetZone."
          actionText="Browse Shop 🐾"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 bg-[#F6F2EC] min-h-screen">
      
      <div className="pb-3 border-b border-[#E8E2D9]">
        <h1 className="text-xl font-black text-[#2C221E] flex items-center gap-2">
          <Package className="w-5 h-5 text-[#E08838]" />
          My Orders History
        </h1>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const items = order.items || [];
          return (
            <div key={order.id || order.orderId || order._id} className="bg-white rounded-3xl p-5 border border-[#E8E2D9] space-y-3 shadow-xs">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-[#FAF5EE]">
                <span className="font-extrabold text-[#E08838]">{order.orderId || order.id || order._id}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                  {order.status || 'Placed'}
                </span>
              </div>

              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img src={item.image} alt="" className="w-10 h-10 rounded-xl object-cover bg-[#FAF5EE]" />
                      <span className="font-bold text-[#2C221E]">{item.name} (×{item.quantity})</span>
                    </div>
                    <span className="font-black text-[#2C221E]">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[#FAF5EE] flex justify-between text-xs font-black text-[#2C221E]">
                <span>Total (COD)</span>
                <span className="text-base text-[#E08838]">₹{(order.totalAmount || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
