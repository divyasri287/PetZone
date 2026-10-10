import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, Package, ShoppingBag } from 'lucide-react';

export default function OrderSuccess() {
  const location = useLocation();
  const { order, orderId } = location.state || {};

  if (!order) return <Navigate to="/my-orders" replace />;

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6 bg-[#F6F2EC] min-h-screen flex flex-col justify-center">
      <div className="bg-white rounded-3xl border border-[#E8E2D9] p-8 shadow-xs text-center space-y-4">
        
        <div className="w-16 h-16 rounded-full bg-[#FAF5EE] text-[#E08838] flex items-center justify-center mx-auto text-3xl">
          🎉
        </div>

        <h1 className="text-2xl font-black text-[#2C221E]">
          Order Confirmed!
        </h1>

        <div className="p-4 bg-[#FAF5EE] rounded-2xl border border-[#E8E2D9] text-left text-xs space-y-1.5 font-bold text-[#2C221E]">
          <div className="flex justify-between">
            <span className="text-stone-500">Order ID:</span>
            <span className="text-[#E08838]">{orderId || order.orderId || order._id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Total (COD):</span>
            <span>₹{order.totalAmount?.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-[#E8E2D9]">
            <span className="text-stone-500">Estimated Delivery:</span>
            <span>Within 3 Days</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Link
            to="/my-orders"
            className="w-full py-3 bg-[#E08838] hover:bg-[#C87428] text-white font-extrabold text-xs rounded-full shadow-xs flex items-center justify-center gap-1.5"
          >
            <Package className="w-4 h-4" /> View My Orders
          </Link>

          <Link
            to="/shop"
            className="w-full py-3 bg-[#FAF5EE] text-[#2C221E] font-extrabold text-xs rounded-full border border-[#E8E2D9] flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
}
