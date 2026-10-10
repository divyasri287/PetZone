import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { productService } from '../services/productService';
import { CATEGORIES } from '../data/fallbackProducts';

export default function Home() {
  const [popularProducts, setPopularProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);
      try {
        const [popular, recommended] = await Promise.all([
          productService.getFeaturedProducts(),
          productService.getBestSellers()
        ]);
        setPopularProducts(popular.slice(0, 4));
        setRecommendedProducts(recommended.slice(0, 4));
      } catch (error) {
        console.error("Failed to load home products", error);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 bg-[#F6F2EC]">
      
      {/* 1. Minimal Cute Pet Welcome Banner */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D9] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-3 text-center sm:text-left">
          <div className="inline-block bg-[#FAF5EE] px-3 py-1 rounded-full text-xs font-black text-[#E08838]">
            🐾 Love Them. Spoil Them.
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#2C221E] tracking-tight">
            Hi pal! Welcome to PetZone
          </h1>
          <div className="pt-1">
            <Link
              to="/shop"
              className="px-6 py-2.5 bg-[#E08838] hover:bg-[#C87428] text-white font-extrabold text-xs rounded-full shadow-xs transition-all inline-flex items-center gap-1.5"
            >
              Explore Shop 🐾
            </Link>
          </div>
        </div>

        <div className="w-28 h-28 rounded-full bg-[#FAF5EE] border border-[#E8E2D9] flex items-center justify-center text-5xl shadow-inner shrink-0">
          🐶
        </div>
      </section>

      {/* 2. Shop by Category */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-[#2C221E]">Shop by Category</h2>
          <Link to="/shop" className="text-xs font-extrabold text-[#E08838] hover:underline">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* 3. Popular Products */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-[#2C221E]">Popular Products</h2>
          <Link to="/shop" className="text-xs font-extrabold text-[#E08838] hover:underline">
            View All
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner type="skeleton" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Recommended Products */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-[#2C221E]">Recommended for Your Pet</h2>
          <Link to="/shop" className="text-xs font-extrabold text-[#E08838] hover:underline">
            View All
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner type="skeleton" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
