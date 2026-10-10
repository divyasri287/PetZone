import api from './api';
import { FALLBACK_PRODUCTS, CATEGORIES } from '../data/fallbackProducts';

// Normalize a product from MongoDB (has _id) to use both _id and id
const normalizeProduct = (p) => ({
  ...p,
  _id: p._id || p.id,
  id: String(p._id || p.id),
});

export const productService = {
  // Get products with optional search, category, and sorting filters
  async getProducts(params = {}) {
    const { category, search, sort, minPrice, maxPrice, rating } = params;

    try {
      const response = await api.get('/products', { params });
      const rawProducts = response.data.products || response.data;
      return {
        products: rawProducts.map(normalizeProduct),
        total: response.data.total || rawProducts.length,
        isDemo: false
      };
    } catch (error) {
      if (error.isNetworkError || error.status === 404) {
        console.warn('Backend API unavailable. Using PetZone fallback product dataset.');
        
        let filtered = [...FALLBACK_PRODUCTS];

        // Category filter
        if (category && category !== 'all') {
          const catNorm = category.toLowerCase().replace('-', ' ');
          filtered = filtered.filter(p => 
            p.category.toLowerCase().replace('-', ' ') === catNorm ||
            p.category.toLowerCase().includes(catNorm) ||
            catNorm.includes(p.category.toLowerCase())
          );
        }

        // Search filter
        if (search && search.trim() !== '') {
          const query = search.toLowerCase().trim();
          filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            (p.brand && p.brand.toLowerCase().includes(query))
          );
        }

        // Rating filter
        if (rating) {
          const minRating = parseFloat(rating);
          filtered = filtered.filter(p => p.rating >= minRating);
        }

        // Price range filter
        if (minPrice) {
          filtered = filtered.filter(p => p.price >= Number(minPrice));
        }
        if (maxPrice) {
          filtered = filtered.filter(p => p.price <= Number(maxPrice));
        }

        // Sorting
        if (sort) {
          if (sort === 'price-low') {
            filtered.sort((a, b) => a.price - b.price);
          } else if (sort === 'price-high') {
            filtered.sort((a, b) => b.price - a.price);
          } else if (sort === 'rating') {
            filtered.sort((a, b) => b.rating - a.rating);
          } else if (sort === 'discount') {
            filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
          }
        }

        return {
          products: filtered,
          total: filtered.length,
          isDemo: true,
          notice: 'Products loaded from local dataset (Demo Mode).'
        };
      }
      throw error;
    }
  },

  // Get single product details by ID
  async getProductById(id) {
    try {
      const response = await api.get(`/products/${id}`);
      return { product: normalizeProduct(response.data.product || response.data), isDemo: false };
    } catch (error) {
      if (error.isNetworkError || error.status === 404) {
        const found = FALLBACK_PRODUCTS.find(p => p.id === id || String(p.id) === String(id));
        if (found) {
          return { product: found, isDemo: true };
        }
        throw { message: `Product with ID "${id}" was not found.` };
      }
      throw error;
    }
  },

  // Get product categories list
  async getCategories() {
    try {
      const response = await api.get('/products/categories');
      return { categories: response.data, isDemo: false };
    } catch (error) {
      return { categories: CATEGORIES, isDemo: true };
    }
  },

  // Get featured products
  async getFeaturedProducts() {
    try {
      const res = await this.getProducts();
      return res.products.filter(p => p.isFeatured || p.rating >= 4.7).slice(0, 6);
    } catch (err) {
      return FALLBACK_PRODUCTS.slice(0, 6);
    }
  },

  // Get best sellers
  async getBestSellers() {
    try {
      const res = await this.getProducts();
      return res.products.filter(p => p.isBestSeller).slice(0, 6);
    } catch (err) {
      return FALLBACK_PRODUCTS.filter(p => p.isBestSeller);
    }
  }
};
