import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product }) {
  const { addToCart, cartItems } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);
  const inCart = cartItems.some(item => item.id === product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group relative bg-white rounded-3xl border border-[#E8E2D9] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col h-full overflow-hidden">
      
      {/* Product Image */}
      <div className="relative aspect-square w-full bg-[#FAF5EE] overflow-hidden">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/catfood/whiskas.svg";
            }}
          />
        </Link>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all shadow-xs ${
            inWishlist 
              ? 'bg-rose-500 text-white' 
              : 'bg-white/90 text-stone-600 hover:text-rose-500'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Details & Price */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#E08838] bg-[#FAF5EE] px-2.5 py-0.5 rounded-full">
            {product.category}
          </span>

          <Link to={`/product/${product.id}`} className="block mt-1">
            <h3 className="text-sm font-extrabold text-[#2C221E] line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Footer Price & Orange Paw Action Button */}
        <div className="pt-2 border-t border-[#FAF5EE] flex items-center justify-between gap-2">
          <span className="text-lg font-black text-[#2C221E]">
            ₹{product.price.toLocaleString('en-IN')}
          </span>

          <button
            onClick={handleAddToCart}
            className={`px-3.5 py-2 rounded-full font-extrabold text-xs flex items-center gap-1 transition-all shadow-xs ${
              inCart
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-[#E08838] hover:bg-[#C87428] text-white'
            }`}
          >
            {inCart ? (
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Added
              </span>
            ) : (
              <span className="flex items-center gap-1">
                Add 🐾
              </span>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
