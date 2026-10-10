import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Search, PackageX, ArrowRight } from 'lucide-react';

export default function EmptyState({ 
  icon = "cart", 
  title = "No items found", 
  description = "Explore our wide range of premium pet products and spoil your furry friend!", 
  actionText = "Continue Shopping", 
  actionLink = "/shop" 
}) {
  const renderIcon = () => {
    switch (icon) {
      case 'cart':
        return <ShoppingBag className="w-12 h-12 text-[#244B3B]" />;
      case 'wishlist':
        return <Heart className="w-12 h-12 text-rose-500" />;
      case 'search':
        return <Search className="w-12 h-12 text-[#4E7B66]" />;
      case 'orders':
        return <PackageX className="w-12 h-12 text-stone-500" />;
      default:
        return <ShoppingBag className="w-12 h-12 text-[#244B3B]" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 p-12 text-center max-w-lg mx-auto shadow-xs my-8">
      <div className="w-20 h-20 rounded-full bg-[#E8EFEA] flex items-center justify-center mx-auto mb-6">
        {renderIcon()}
      </div>
      <h3 className="text-2xl font-black text-stone-900 mb-2">{title}</h3>
      <p className="text-sm text-stone-500 mb-8 leading-relaxed max-w-sm mx-auto">{description}</p>
      
      {actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#244B3B] hover:bg-[#1A3328] text-white font-bold text-sm rounded-2xl shadow-sm hover:shadow-md transition-all"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
