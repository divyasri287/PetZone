import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  User, 
  LogOut, 
  Package, 
  Menu, 
  X, 
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const categories = [
    { name: 'All', path: '/shop', icon: '🛍️' },
    { name: 'Dog Food', path: '/shop/dog-food', icon: '🐶' },
    { name: 'Cat Food', path: '/shop/cat-food', icon: '🐱' },
    { name: 'Toys', path: '/shop/toys', icon: '🎾' },
    { name: 'Accessories', path: '/shop/accessories', icon: '🦴' },
    { name: 'Grooming', path: '/shop/grooming', icon: '✂️' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#F6F2EC] border-b border-[#E8E2D9] shadow-xs">
      
      {/* Top Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#E08838] flex items-center justify-center text-white font-bold text-xl shadow-xs">
              🐶
            </div>
            <span className="text-xl font-black text-[#2C221E] tracking-tight">
              Pet<span className="text-[#E08838]">Zone</span>
            </span>
          </Link>

          {/* Search Input */}
          <div className="flex-1 max-w-md mx-2">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search pet products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#E8E2D9] rounded-full focus:outline-none focus:border-[#E08838]"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>
          </div>

          {/* Actions & Profile */}
          <div className="flex items-center space-x-2 shrink-0">
            
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-full bg-white border border-[#E8E2D9] text-[#2C221E] hover:text-[#E08838] transition-colors"
              title="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E08838] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-full bg-white border border-[#E8E2D9] text-[#2C221E] hover:text-[#E08838] transition-colors"
              title="Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E08838] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile Dropdown - Shows ONLY First Letter Circle */}
            {isAuthenticated && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-1 p-1 rounded-full bg-white border border-[#E8E2D9] text-xs font-bold text-[#2C221E] hover:bg-[#FAF5EE]"
                  title="Account Profile"
                >
                  <div className="w-7 h-7 rounded-full bg-[#E08838] text-white flex items-center justify-center text-xs font-extrabold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'U')}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400 mr-0.5" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-lg border border-[#E8E2D9] py-1 z-50">
                    <div className="px-4 py-2 border-b border-[#FAF5EE]">
                      <p className="text-xs font-bold text-[#2C221E] truncate">{user?.name || 'Customer'}</p>
                      <p className="text-[11px] text-stone-500 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#2C221E] hover:bg-[#FAF5EE]"
                    >
                      <User className="w-4 h-4" /> Profile
                    </Link>

                    <Link
                      to="/my-orders"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#2C221E] hover:bg-[#FAF5EE]"
                    >
                      <Package className="w-4 h-4" /> My Orders
                    </Link>

                    <div className="border-t border-[#FAF5EE] mt-1 pt-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 text-left"
                      >
                        <LogOut className="w-4 h-4" /> Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Drawer */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#2C221E]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Horizontal Orange Pill Category Bar */}
      <div className="bg-white border-t border-[#E8E2D9] overflow-x-auto scrollbar-none py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-start md:justify-center space-x-2 min-w-max">
          {categories.map((cat) => (
            <NavLink
              key={cat.name}
              to={cat.path}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                  isActive
                    ? 'bg-[#E08838] text-white shadow-xs'
                    : 'bg-[#FAF5EE] text-[#2C221E] border border-[#E8E2D9] hover:bg-[#E08838] hover:text-white'
                }`
              }
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white px-4 py-3 border-t border-[#E8E2D9] space-y-2">
          <Link to="/" className="block py-1.5 text-xs font-bold text-[#2C221E]">Home</Link>
          <Link to="/shop" className="block py-1.5 text-xs font-bold text-[#2C221E]">Shop All</Link>
          <Link to="/my-orders" className="block py-1.5 text-xs font-bold text-[#2C221E]">My Orders</Link>
          <Link to="/profile" className="block py-1.5 text-xs font-bold text-[#2C221E]">Profile</Link>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="block w-full text-left py-1.5 text-xs font-bold text-red-600"
          >
            Log Out
          </button>
        </div>
      )}

    </header>
  );
}
