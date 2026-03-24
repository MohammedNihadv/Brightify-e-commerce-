import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Breadcrumb from '../components/Breadcrumb';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Shop = () => {
  const { keyword, categorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/products/categories/`);
            setCategories(data);
        } catch (err) {
            console.error("Error fetching categories", err);
        }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = `${import.meta.env.VITE_API_URL || ''}/api/products/?page=all`;
        if (categorySlug) {
            url = `${import.meta.env.VITE_API_URL || ''}/api/products/categories/${categorySlug}/`;
        } else if (keyword) {
            url = `${import.meta.env.VITE_API_URL || ''}/api/products/?keyword=${keyword}&page=all`;
        }
        
        const { data } = await axios.get(url);
        
        if (data.category && data.products) {
            setProducts(data.products || []);
            setCategoryName(data.category.name);
        } else {
            setProducts(data.products || []);
            setCategoryName('');
        }
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Something went wrong');
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword, categorySlug]);

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
  ];
  if (categoryName) {
    breadcrumbItems.push({ label: categoryName, path: `/category/${categorySlug}` });
  } else if (keyword) {
    breadcrumbItems.push({ label: `Search: ${keyword}`, path: `/search/${keyword}` });
  }

  // Live filter computation
  const filteredProducts = products.filter(p => {
    const price = Number(p.price);
    const rating = p.reviews?.length > 0 ? (p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length) : 0;
    
    if (price < minPrice || price > maxPrice) return false;
    if (minRating > 0 && rating < minRating) return false;
    
    return true;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="py-4 md:py-8 max-w-7xl mx-auto px-2 md:px-4"
    >
      <div className="mb-4 md:mb-8 flex justify-between items-center w-full">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      
      {/* Mobile Filter Toggle */}
      <button 
        onClick={() => setShowFilters(!showFilters)}
        className="lg:hidden w-full glass-button py-2 px-4 mb-4 text-xs font-bold uppercase tracking-wider rounded-xl border border-white/20 flex items-center justify-center gap-2"
      >
        <svg className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        {showFilters ? 'Hide Filters' : 'Filters & Categories'}
      </button>

      <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
        
        {/* Sidebar Filters - hidden on mobile by default */}
        <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="glass p-4 md:p-6 rounded-2xl md:rounded-3xl sticky top-24">
            <h2 className="text-lg md:text-2xl font-bold mb-4 md:mb-6 text-teal-300 border-b border-white/10 pb-3 md:pb-4">Filters</h2>
            
            {/* Categories */}
            <div className="mb-4 md:mb-8">
              <h3 className="text-sm md:text-lg font-semibold mb-2 md:mb-4 text-white">Categories</h3>
              <ul className="space-y-1.5 md:space-y-3 text-gray-300 text-sm">
                <li><Link to="/shop" className={`hover:text-teal-300 transition-colors ${!categorySlug ? 'text-teal-300 font-bold' : ''}`}>All Products</Link></li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <Link 
                      to={`/category/${cat.slug}`} 
                      className={`hover:text-teal-300 transition-colors ${categorySlug === cat.slug ? 'text-teal-300 font-bold' : ''}`}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Range */}
            <div className="mb-4 md:mb-8">
              <h3 className="text-sm md:text-lg font-semibold mb-2 md:mb-4 text-white">Price (₹)</h3>
              <div className="flex items-center space-x-2">
                 <input type="number" value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} className="glass-input w-full p-2 text-sm text-white focus:outline-teal-400" placeholder="Min" />
                 <span className="text-gray-400">-</span>
                 <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="glass-input w-full p-2 text-sm text-white focus:outline-teal-400" placeholder="Max" />
              </div>
            </div>

            {/* Minimum Rating */}
            <div className="mb-4 md:mb-8">
              <h3 className="text-sm md:text-lg font-semibold mb-2 md:mb-4 text-white">Minimum Rating</h3>
              <select value={minRating} onChange={e => setMinRating(Number(e.target.value))} className="glass-input p-2 w-full text-white cursor-pointer [&>option]:text-black focus:outline-teal-400">
                <option value={0}>All Ratings</option>
                <option value={4}>4★ & above</option>
                <option value={3}>3★ & above</option>
                <option value={2}>2★ & above</option>
                <option value={1}>1★ & above</option>
              </select>
            </div>

            <button 
              onClick={() => { setMinPrice(0); setMaxPrice(100000); setMinRating(0); }} 
              className="w-full glass-button p-2 text-sm border-red-500/30 text-red-300 hover:bg-red-500/20"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:w-3/4">
          <h1 className="text-4xl md:text-5xl font-black mb-10 pb-4 pt-2 leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-blue-200 drop-shadow-2xl">
            {categoryName ? `${categoryName}` : keyword ? `Search Results for "${keyword}"` : 'All Products'}
            <span className="text-sm text-gray-400 font-normal ml-4 inline-block align-middle mb-1">({filteredProducts.length} items)</span>
          </h1>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : error ? (
            <div className="glass bg-red-500/20 border-red-500/50 p-6 text-center rounded-xl">
              <h3 className="text-2xl font-bold text-red-200 mb-2">Error Loading Products</h3>
              <p className="text-red-100">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 md:gap-8 px-2 md:px-0">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center text-gray-400 py-12 glass rounded-2xl border-dashed">
                  No products match your current filters. Try adjusting your criteria.
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
};

export default Shop;
