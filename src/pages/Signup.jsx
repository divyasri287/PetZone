import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Phone, Lock, AlertCircle } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (apiError) setApiError(null);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Full name required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) newErrors.email = 'Email required';
    else if (!emailRegex.test(formData.email.trim())) newErrors.email = 'Invalid email';

    const phoneRegex = /^[0-9+\s-]{10,14}$/;
    if (!formData.phone.trim()) newErrors.phone = 'Mobile number required';
    else if (!phoneRegex.test(formData.phone.trim())) newErrors.phone = 'Invalid phone number';

    if (!formData.password) newErrors.password = 'Password required';
    else if (formData.password.length < 6) newErrors.password = 'At least 6 characters';

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      await signup({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password
      });

      navigate('/login', {
        state: { message: 'Account created! Please log in.' }
      });
    } catch (err) {
      setApiError(err.message || 'Failed to create account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Register">
      {apiError && (
        <div className="p-3 rounded-2xl bg-red-50 text-red-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        
        <div>
          <label className="block text-xs font-bold text-[#2C221E] uppercase tracking-wider mb-1">
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              name="name"
              placeholder="Ramesh Kumar"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF5EE] border border-[#E8E2D9] rounded-2xl focus:bg-white focus:outline-none focus:border-[#E08838]"
            />
            <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          {errors.name && <p className="text-xs text-red-500 font-bold mt-0.5">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-[#2C221E] uppercase tracking-wider mb-1">
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="name@domain.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF5EE] border border-[#E8E2D9] rounded-2xl focus:bg-white focus:outline-none focus:border-[#E08838]"
            />
            <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          {errors.email && <p className="text-xs text-red-500 font-bold mt-0.5">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-[#2C221E] uppercase tracking-wider mb-1">
            Mobile Number
          </label>
          <div className="relative">
            <input
              type="tel"
              name="phone"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF5EE] border border-[#E8E2D9] rounded-2xl focus:bg-white focus:outline-none focus:border-[#E08838]"
            />
            <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          {errors.phone && <p className="text-xs text-red-500 font-bold mt-0.5">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-[#2C221E] uppercase tracking-wider mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-[#FAF5EE] border border-[#E8E2D9] rounded-2xl focus:bg-white focus:outline-none focus:border-[#E08838]"
            />
            <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500 font-bold mt-0.5">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-[#2C221E] uppercase tracking-wider mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF5EE] border border-[#E8E2D9] rounded-2xl focus:bg-white focus:outline-none focus:border-[#E08838]"
            />
            <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-500 font-bold mt-0.5">{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 px-5 bg-[#E08838] hover:bg-[#C87428] text-white font-extrabold text-sm rounded-full shadow-xs transition-all flex items-center justify-center gap-2 mt-3"
        >
          {submitting ? 'Registering...' : 'Register 🐾'}
        </button>

        <div className="text-center pt-2">
          <p className="text-xs text-[#6E6259]">
            Already have an account?{' '}
            <Link to="/login" className="font-extrabold text-[#E08838] hover:underline">
              Log In
            </Link>
          </p>
        </div>

      </form>
    </AuthLayout>
  );
}
