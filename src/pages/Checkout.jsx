import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { CreditCard, MapPin, User, Phone, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/orderService';

export default function Checkout() {
  const { user } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return <Navigate to="/shop" replace />;
  }

  const deliveryFee = cartTotal >= 999 ? 0 : 99;
  const grandTotal = cartTotal + deliveryFee;

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || 'Karnataka',
    pincode: user?.pincode || '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (apiError) setApiError(null);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Full name required';
    if (!formData.phone.trim()) newErrors.phone = 'Mobile number required';
    if (!formData.email.trim()) newErrors.email = 'Email required';
    if (!formData.address.trim()) newErrors.address = 'Street address required';
    if (!formData.city.trim()) newErrors.city = 'City required';
    if (!formData.pincode.trim()) newErrors.pincode = 'PIN code required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) return;

    setSubmitting(true);
    try {
      const orderPayload = {
        items: cartItems.map(item => ({
          product: item._id || item.id,   // Use MongoDB _id when available
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: formData.name.trim(),     // Backend expects 'fullName'
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim()
        },
        paymentMethod: 'Cash on Delivery',   // Must match backend enum
      };

      const result = await orderService.createOrder(orderPayload);

      clearCart();

      navigate('/order-success', {
        state: {
          order: result.order,
          orderId: result.orderId,
          isDemo: result.isDemo
        },
        replace: true
      });

    } catch (err) {
      setApiError(err.message || 'Failed to place order.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-[#F6F2EC] min-h-screen">
      
      <div className="pb-3 border-b border-[#E8E2D9]">
        <h1 className="text-2xl font-black text-[#2C221E]">Checkout</h1>
      </div>

      {apiError && (
        <div className="p-3 rounded-2xl bg-red-50 text-red-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Address Form */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 border border-[#E8E2D9] space-y-4">
          <h2 className="text-base font-black text-[#2C221E] flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#E08838]" /> Shipping Address
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#2C221E] uppercase mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-[#FAF5EE] border border-[#E8E2D9] rounded-xl focus:bg-white focus:outline-none"
              />
              {errors.name && <p className="text-xs text-red-500 font-bold mt-0.5">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-[#2C221E] uppercase mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs bg-[#FAF5EE] border border-[#E8E2D9] rounded-xl focus:bg-white focus:outline-none"
                />
                {errors.phone && <p className="text-xs text-red-500 font-bold mt-0.5">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C221E] uppercase mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs bg-[#FAF5EE] border border-[#E8E2D9] rounded-xl focus:bg-white focus:outline-none"
                />
                {errors.email && <p className="text-xs text-red-500 font-bold mt-0.5">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C221E] uppercase mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-[#FAF5EE] border border-[#E8E2D9] rounded-xl focus:bg-white focus:outline-none"
              />
              {errors.address && <p className="text-xs text-red-500 font-bold mt-0.5">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-bold text-[#2C221E] uppercase mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs bg-[#FAF5EE] border border-[#E8E2D9] rounded-xl focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#2C221E] uppercase mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs bg-[#FAF5EE] border border-[#E8E2D9] rounded-xl focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#2C221E] uppercase mb-1">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs bg-[#FAF5EE] border border-[#E8E2D9] rounded-xl focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E8E2D9]">
            <span className="text-xs font-extrabold text-[#2C221E] block mb-1">Payment Method</span>
            <div className="p-3 rounded-2xl bg-[#FAF5EE] border border-[#E08838] flex items-center justify-between text-xs font-bold text-[#2C221E]">
              <span>Cash on Delivery (COD) 💵</span>
              <span className="text-[#E08838]">Verified</span>
            </div>
          </div>
        </div>

        {/* Order Summary Side */}
        <div className="md:col-span-5 bg-white rounded-3xl p-6 border border-[#E8E2D9] space-y-4">
          <h2 className="text-base font-black text-[#2C221E]">Order Summary</h2>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-xs">
                <span className="font-bold text-[#2C221E] truncate max-w-[180px]">{item.name} × {item.quantity}</span>
                <span className="font-black text-[#2C221E]">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E8E2D9] flex justify-between text-base font-black text-[#2C221E]">
            <span>Total Amount</span>
            <span className="text-[#E08838]">₹{grandTotal.toLocaleString('en-IN')}</span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-6 bg-[#E08838] hover:bg-[#C87428] text-white font-black text-sm rounded-full shadow-xs flex items-center justify-center gap-2"
          >
            {submitting ? 'Placing Order...' : 'Place Order (COD) 🐾'}
          </button>
        </div>

      </form>
    </div>
  );
}
