import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, Package, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    pincode: user?.pincode || ''
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6 bg-[#F6F2EC] min-h-screen">
      
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D9]">
        <h1 className="text-xl font-black text-[#2C221E] flex items-center gap-2">
          <User className="w-5 h-5 text-[#E08838]" /> My Profile
        </h1>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 bg-[#E08838] text-white font-bold text-xs rounded-full flex items-center gap-1"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl p-6 border border-[#E8E2D9] space-y-4 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-[#FAF5EE]">
          <div className="w-12 h-12 rounded-full bg-[#E08838] text-white flex items-center justify-center font-black text-xl">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="text-base font-black text-[#2C221E]">{user?.name}</h2>
            <p className="text-xs text-[#6E6259]">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-3 text-xs font-bold text-[#2C221E]">
          <div>
            <label className="block uppercase text-stone-400 mb-1">Full Name</label>
            {isEditing ? (
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 bg-[#FAF5EE] border border-[#E8E2D9] rounded-xl" />
            ) : (
              <p className="text-sm">{user?.name || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block uppercase text-stone-400 mb-1">Mobile</label>
            {isEditing ? (
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 bg-[#FAF5EE] border border-[#E8E2D9] rounded-xl" />
            ) : (
              <p className="text-sm">{user?.phone || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block uppercase text-stone-400 mb-1">Address</label>
            {isEditing ? (
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-3 py-2 bg-[#FAF5EE] border border-[#E8E2D9] rounded-xl" />
            ) : (
              <p className="text-sm">{user?.address || 'Not set'}</p>
            )}
          </div>

          {isEditing && (
            <div className="flex items-center gap-2 pt-2">
              <button type="submit" disabled={submitting} className="px-4 py-2 bg-[#E08838] text-white rounded-full flex items-center gap-1">
                <Save className="w-3.5 h-3.5" /> Save
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-[#FAF5EE] text-[#2C221E] rounded-full">
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>

      <div className="bg-white rounded-3xl p-4 border border-[#E8E2D9] flex items-center justify-between">
        <Link to="/my-orders" className="flex items-center gap-2 text-xs font-black text-[#2C221E]">
          <Package className="w-4 h-4 text-[#E08838]" /> View Orders History
        </Link>

        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="px-3 py-1.5 bg-red-50 text-red-600 font-bold text-xs rounded-full flex items-center gap-1"
        >
          <LogOut className="w-3.5 h-3.5" /> Log Out
        </button>
      </div>

    </div>
  );
}
