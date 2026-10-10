import React from 'react';
import { Link } from 'react-router-dom';

export default function CategoryCard({ category }) {
  const categorySlug = category.name.toLowerCase().replace(/\s+/g, '-');

  return (
    <Link
      to={`/shop/${categorySlug}`}
      className="group relative bg-white rounded-3xl p-4 border border-[#E8E2D9] shadow-xs hover:border-[#E08838] hover:shadow-md transition-all flex flex-col items-center text-center space-y-2"
    >
      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#FAF5EE] border border-[#E8E2D9]">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
      </div>

      <h3 className="text-xs font-black text-[#2C221E] group-hover:text-[#E08838] transition-colors">
        {category.name}
      </h3>
    </Link>
  );
}
