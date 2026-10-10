import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { productService } from '../services/productService';

export default function Shop() {
  const { category: categoryParam } = useParams();
  const [searchParams] = useSearchParams();

  const searchFromUrl = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all');
  const [searchQuery, setSearchQuery] = useState(searchFromUrl);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
    else setSelectedCategory('all');
  }, [categoryParam]);

  useEffect(() => {
    setSearchQuery(searchFromUrl);
  }, [searchFromUrl]);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productService.getProducts({
        category: selectedCategory,
        search: searchQuery,
        sort: sortBy
      });
      setProducts(res.products || []);
    } catch (err) {
      setError(err.message || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 bg-[#F6F2EC] min-h-screen">
      
      {/* Top Header Bar: Results Count & Sort Dropdown */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] px-4 py-3 shadow-xs flex items-center justify-between">
        <span className="text-xs font-black text-[#2C221E]">
          {products.length} Products Available
        </span>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-500 hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3.5 py-1.5 text-xs font-extrabold bg-[#FAF5EE] border border-[#E8E2D9] rounded-full text-[#2C221E] focus:outline-none focus:border-[#E08838]"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <LoadingSpinner type="skeleton" />
      ) : error ? (
        <div className="bg-white rounded-3xl p-8 border border-red-200 text-center space-y-3">
          <p className="text-xs font-bold text-red-600">{error}</p>
          <button
            onClick={loadProducts}
            className="px-4 py-2 bg-[#E08838] text-white text-xs font-bold rounded-full inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon="search"
          title="No Products Found"
          description="Try selecting a different category from the top bar or search term."
          actionText="View All Products 🐾"
          actionLink="/shop"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}
