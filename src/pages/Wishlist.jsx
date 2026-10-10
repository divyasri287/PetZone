import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';

export default function Wishlist() {
  const { wishlistItems, clearWishlist } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12">
        <EmptyState
          icon="wishlist"
          title="Wishlist is Empty"
          description="Click the heart button on products to save them."
          actionText="Explore Shop 🐾"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 bg-[#F6F2EC] min-h-screen">
      
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D9]">
        <h1 className="text-xl font-black text-[#2C221E] flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          My Wishlist ({wishlistItems.length})
        </h1>

        <button
          onClick={clearWishlist}
          className="text-xs font-bold text-stone-500 hover:text-red-600 flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {wishlistItems.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

    </div>
  );
}
