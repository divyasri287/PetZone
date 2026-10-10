import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const flashMessage = location.state?.message;
  const intendedDestination = location.state?.from?.pathname || '/';

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) newErrors.email = 'Email required';
    else if (!emailRegex.test(email.trim())) newErrors.email = 'Invalid email';

    if (!password) newErrors.password = 'Password required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate(intendedDestination, { replace: true });
    } catch (err) {
      setApiError(err.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickFill = () => {
    setEmail('demo.customer@petzone.com');
    setPassword('petzone123');
    setErrors({});
    setApiError(null);
  };

  return (
    <AuthLayout title="Log In">
      {flashMessage && (
        <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{flashMessage}</span>
        </div>
      )}

      {apiError && (
        <div className="p-3 rounded-2xl bg-red-50 text-red-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      {/* Auto-fill Button */}
      <div className="p-2.5 rounded-2xl bg-[#FAF5EE] border border-[#E8E2D9] flex items-center justify-between">
        <span className="text-xs font-extrabold text-[#2C221E]">Demo Credentials</span>
        <button
          type="button"
          onClick={handleQuickFill}
          className="px-3 py-1 bg-[#E08838] text-white text-xs font-bold rounded-full hover:bg-[#C87428]"
        >
          Auto-fill
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="block text-xs font-bold text-[#2C221E] uppercase tracking-wider mb-1">
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              placeholder="demo.customer@petzone.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF5EE] border border-[#E8E2D9] rounded-2xl focus:bg-white focus:outline-none focus:border-[#E08838]"
            />
            <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          {errors.email && <p className="text-xs text-red-500 font-bold mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-[#2C221E] uppercase tracking-wider mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          {errors.password && <p className="text-xs text-red-500 font-bold mt-1">{errors.password}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 px-5 bg-[#E08838] hover:bg-[#C87428] text-white font-extrabold text-sm rounded-full shadow-xs transition-all flex items-center justify-center gap-2 mt-2"
        >
          {submitting ? 'Logging in...' : 'Log In 🐾'}
        </button>

        <div className="text-center pt-2">
          <p className="text-xs text-[#6E6259]">
            Don't have an account?{' '}
            <Link to="/signup" className="font-extrabold text-[#E08838] hover:underline">
              Sign Up
            </Link>
          </p>
        </div>

      </form>
    </AuthLayout>
  );
}
