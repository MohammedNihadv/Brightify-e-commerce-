import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner';
import Loader from '../components/Loader';

const CATEGORIES = [
  { name: 'Home Lighting', slug: 'home-lighting' },
  { name: 'Outdoor Lighting', slug: 'outdoor-lighting' },
  { name: 'Smart Lighting', slug: 'smart-lighting' },
  { name: 'Energy-Saving Bulbs', slug: 'energy-saving-bulbs' }
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/products/`);
        // The backend returns { products: [...], page: 1, pages: 1 }
        const productList = Array.isArray(data?.products) ? data.products : Array.isArray(data) ? data : [];
        setProducts(productList.slice(0, 8));
        setLoading(false);
      } catch (err) {
        console.error('Product fetch error:', err);
        setError(err.message || 'Something went wrong');
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="animate-fade-in pb-12">
      <HeroBanner />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 px-4 w-full max-w-5xl mx-auto">
        {CATEGORIES.map((cat, idx) => (
          <Link 
            to={`/category/${cat.slug}`} 
            key={idx} 
            className="glass flex items-center justify-center px-2 py-3 md:py-4 text-center rounded-xl border-yellow-500/20 hover:border-yellow-400/60 cursor-pointer transition-all active:scale-95 hover:-translate-y-1 h-full shadow-[0_4px_15px_rgba(0,0,0,0.2)]"
          >
            <span className="text-xs md:text-sm font-bold text-yellow-100 leading-tight">{cat.name}</span>
          </Link>
        ))}
      </div>

      <h2 className="text-3xl font-bold mb-8 pl-4 border-l-4 border-yellow-400 text-yellow-50">Latest Arrivals</h2>
      
      {loading ? (
        <Loader message="Loading Products..." />
      ) : error ? (
        <div className="glass bg-red-500/20 border-red-500/50 p-6 text-center rounded-xl">
          <h3 className="text-2xl font-bold text-red-200 mb-2">Error Loading Products</h3>
          <p className="text-red-100">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8 px-2 sm:px-0">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
