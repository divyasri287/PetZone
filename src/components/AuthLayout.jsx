import React from 'react';
import { Link } from 'react-router-dom';

export default function AuthLayout({ children, title }) {
  return (
    <div className="min-h-screen bg-[#F6F2EC] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E8E2D9] space-y-6">
        
        {/* Cute Pet Illustration Header */}
        <div className="text-center space-y-2">
          <div className="w-24 h-24 rounded-full bg-[#FAF5EE] border border-[#E8E2D9] flex items-center justify-center mx-auto text-4xl shadow-inner">
            🐶
          </div>

          <Link to="/login" className="inline-block text-2xl font-black text-[#2C221E] tracking-tight">
            Pet<span className="text-[#E08838]">Zone</span>
          </Link>

          {title && (
            <h1 className="text-xl font-extrabold text-[#2C221E] tracking-tight mt-1">
              {title}
            </h1>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}
