import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#FAF5EE] border-t border-[#E8E2D9] py-8 text-[#2C221E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#E08838] flex items-center justify-center text-white text-base">
            🐶
          </div>
          <span className="text-lg font-black tracking-tight text-[#2C221E]">
            Pet<span className="text-[#E08838]">Zone</span>
          </span>
        </Link>

        {/* Essential Navigation Links */}
        <div className="flex items-center space-x-6 text-xs font-extrabold text-[#6E6259]">
          <Link to="/shop" className="hover:text-[#E08838] transition-colors">Shop All</Link>
          <Link to="/shop/dog-food" className="hover:text-[#E08838] transition-colors">Dog Food</Link>
          <Link to="/shop/cat-food" className="hover:text-[#E08838] transition-colors">Cat Food</Link>
          <Link to="/shop/toys" className="hover:text-[#E08838] transition-colors">Toys</Link>
          <Link to="/my-orders" className="hover:text-[#E08838] transition-colors">My Orders</Link>
        </div>

        {/* Copyright */}
        <p className="text-xs font-bold text-[#6E6259]">
          © {new Date().getFullYear()} PetZone. All rights reserved. 🐾
        </p>

      </div>
    </footer>
  );
}
