import React from 'react';
import { Link } from 'react-router-dom';
import { Dog, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-[#FAF7F2] flex items-center justify-center p-4 text-center">
      <div className="bg-white rounded-3xl border border-stone-200/80 p-8 sm:p-12 max-w-md w-full shadow-xl space-y-6">
        
        <div className="w-24 h-24 rounded-full bg-[#E8EFEA] text-[#244B3B] flex items-center justify-center mx-auto shadow-inner">
          <Dog className="w-12 h-12 text-[#244B3B]" />
        </div>

        <div>
          <span className="text-5xl font-black text-[#244B3B] tracking-tight">404</span>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight mt-1">
            Page Not Found
          </h1>
          <p className="text-xs text-stone-500 mt-2 leading-relaxed">
            Oops! The page or pet supply item you're looking for seems to have wandered off!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 bg-[#244B3B] hover:bg-[#1A3328] text-white font-bold text-xs rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>

          <Link
            to="/shop"
            className="w-full sm:w-auto px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-2xl transition-all"
          >
            Browse Shop
          </Link>
        </div>

      </div>
    </div>
  );
}
