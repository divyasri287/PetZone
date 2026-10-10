import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingBag, Minus, Plus, Check, ArrowLeft } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart, cartItems } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await productService.getProductById(id);
        setProduct(res.product);

        if (res.product) {
          const relRes = await productService.getProducts({ category: res.product.category });
          setRelatedProducts(relRes.products.filter(p => p.id !== res.product.id).slice(0, 4));
        }
      } catch (err) {
        setError(err.message || 'Product not found.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <LoadingSpinner text="Loading product..." />;

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12">
        <EmptyState
          icon="search"
          title="Product Not Found"
          description="The product you are looking for is unavailable."
          actionText="Back to Shop"
          actionLink="/shop"
        />
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const inCart = cartItems.some(item => item.id === product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#F6F2EC] min-h-screen">
      
      <Link to="/shop" className="inline-flex items-center gap-1 text-xs font-extrabold text-[#E08838] hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </Link>

      <div className="bg-white rounded-3xl border border-[#E8E2D9] p-6 sm:p-8 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Product Image */}
        <div className="aspect-square bg-[#FAF5EE] rounded-3xl overflow-hidden border border-[#E8E2D9] relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/catfood/whiskas.svg";
            }}
          />
          <button
            onClick={() => toggleWishlist(product)}
            className={`absolute top-3 right-3 p-2.5 rounded-full shadow-xs ${
              inWishlist ? 'bg-rose-500 text-white' : 'bg-white text-stone-700'
            }`}
          >
            <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 bg-[#FAF5EE] text-[#E08838] text-xs font-black rounded-full uppercase tracking-wider">
            {product.category}
          </span>

          <h1 className="text-2xl font-black text-[#2C221E] leading-tight">
            {product.name}
          </h1>

          <div className="text-3xl font-black text-[#2C221E]">
            ₹{product.price.toLocaleString('en-IN')}
          </div>

          <p className="text-xs text-[#6E6259] leading-relaxed">
            {product.description}
          </p>

          {/* Quantity Counter */}
          <div className="flex items-center gap-3 pt-2">
            <span className="text-xs font-bold text-[#2C221E]">Quantity:</span>
            <div className="flex items-center border border-[#E8E2D9] rounded-full bg-[#FAF5EE] p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1 text-[#2C221E] hover:bg-white rounded-full"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-xs font-extrabold text-[#2C221E]">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-1 text-[#2C221E] hover:bg-white rounded-full"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Add to Cart Orange Paw Button */}
          <div className="pt-2">
            <button
              onClick={handleAddToCart}
              className="w-full py-3.5 px-6 bg-[#E08838] hover:bg-[#C87428] text-white font-black text-sm rounded-full shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>{inCart ? "Added to Cart" : "Add to Cart 🐾"}</span>
            </button>
          </div>

        </div>

      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4 pt-4">
          <h2 className="text-lg font-black text-[#2C221E]">Similar Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
