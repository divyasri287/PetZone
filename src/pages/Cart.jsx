import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import EmptyState from '../components/EmptyState';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12">
        <EmptyState
          icon="cart"
          title="Your Cart is Empty"
          description="Add pet products to your cart to get started."
          actionText="Start Shopping 🐾"
          actionLink="/shop"
        />
      </div>
    );
  }

  const deliveryFee = cartTotal >= 999 ? 0 : 99;
  const grandTotal = cartTotal + deliveryFee;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-[#F6F2EC] min-h-screen">
      
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D9]">
        <h1 className="text-2xl font-black text-[#2C221E] flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-[#E08838]" />
          My Cart ({cartItems.length})
        </h1>

        <button
          onClick={clearCart}
          className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      <div className="space-y-3">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-[#E8E2D9] p-4 flex items-center justify-between gap-4 shadow-xs"
          >
            <div className="flex items-center gap-3">
              <img src={item.image} alt="" className="w-14 h-14 rounded-xl object-cover bg-[#FAF5EE]" />
              <div>
                <h3 className="text-xs font-black text-[#2C221E]">{item.name}</h3>
                <p className="text-xs text-[#6E6259]">₹{item.price.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-[#E8E2D9] rounded-full bg-[#FAF5EE] p-1">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-white rounded-full">
                  <Minus className="w-3.5 h-3.5 text-[#2C221E]" />
                </button>
                <span className="w-6 text-center text-xs font-bold text-[#2C221E]">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-white rounded-full">
                  <Plus className="w-3.5 h-3.5 text-[#2C221E]" />
                </button>
              </div>

              <span className="text-sm font-black text-[#2C221E] min-w-[70px] text-right">
                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
              </span>

              <button onClick={() => removeFromCart(item.id)} className="p-1.5 text-stone-400 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order Total & Checkout */}
      <div className="bg-white rounded-3xl border border-[#E8E2D9] p-6 space-y-4 shadow-xs">
        <div className="flex justify-between text-xs font-bold text-[#2C221E]">
          <span>Subtotal</span>
          <span>₹{cartTotal.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between text-xs font-bold text-[#2C221E]">
          <span>Delivery</span>
          <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
        </div>
        <div className="pt-2 border-t border-[#E8E2D9] flex justify-between text-lg font-black text-[#2C221E]">
          <span>Total</span>
          <span className="text-[#E08838]">₹{grandTotal.toLocaleString('en-IN')}</span>
        </div>

        <button
          onClick={() => navigate('/checkout')}
          className="w-full py-3.5 px-6 bg-[#E08838] hover:bg-[#C87428] text-white font-black text-sm rounded-full shadow-xs flex items-center justify-center gap-2"
        >
          <span>Proceed to Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
