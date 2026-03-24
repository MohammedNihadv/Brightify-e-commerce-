import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaEdit } from 'react-icons/fa';
import { getMediaUrl } from '../utils/mediaUtils';

const Categories = () => {
  const userLoginState = useSelector((state) => state.user);
  const { userInfo } = userLoginState;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/products/categories/`);
        setCategories(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Something went wrong');
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen px-4 text-center">
      <div className="glass p-8 rounded-3xl border-red-500/30">
        <h2 className="text-2xl font-bold text-red-300 mb-2">Failed to load categories</h2>
        <p className="text-gray-400">{error}</p>
      </div>
    </div>
  );
  return (
    <div className="py-6 md:py-12 max-w-7xl mx-auto px-3 md:px-4 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 md:mb-16"
      >
        <h1 className="text-2xl md:text-5xl lg:text-6xl font-black mb-3 md:mb-6 py-2 md:py-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-teal-200 to-indigo-300 drop-shadow-2xl">
          EXPLORE CATEGORIES
        </h1>
        <p className="text-gray-400 text-xs md:text-lg max-w-2xl mx-auto font-medium">
          Discover our curated collections of premium lighting solutions tailored for every corner of your life.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 md:gap-8 lg:gap-12">
        {categories.map((category, index) => (
          <motion.div
            key={category.slug}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group relative h-[200px] md:h-[400px] overflow-hidden rounded-2xl md:rounded-[2.5rem] glass border border-white/5 hover:border-white/20 transition-all duration-500 shadow-2xl"
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${getMediaUrl(category.image)})` }}
            />
            
            {/* Mask/Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f2027] via-[#0f2027]/40 to-transparent transition-opacity duration-500 group-hover:opacity-80" />

            {/* Content */}
            <div className="absolute inset-0 p-4 md:p-10 flex flex-col justify-end pointer-events-none">
              <div className="transform translate-y-0 lg:translate-y-4 group-hover:translate-y-0 transition-transform duration-500 pointer-events-auto">
                <span className="text-teal-400 font-bold tracking-[0.2em] text-[9px] md:text-xs uppercase mb-1 md:mb-2 block">
                  {category.count}
                </span>
                <h3 className="text-base md:text-4xl font-black text-white mb-2 md:mb-4 tracking-tight drop-shadow-md leading-tight">
                  {category.name}
                </h3>
                <p className="text-gray-300 text-[10px] md:text-sm mb-3 md:mb-8 max-w-md opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500 line-clamp-2 hidden md:block">
                  {category.description}
                </p>
                
                <div className="flex items-center space-x-2 md:space-x-3 pointer-events-auto">
                  <Link 
                    to={`/category/${category.slug}`}
                    className="inline-flex items-center space-x-1.5 md:space-x-3 glass-button py-1.5 md:py-3 px-3 md:px-8 text-[10px] md:text-sm font-bold opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-500 hover:bg-white hover:text-[#0f2027]"
                  >
                    <span>BROWSE</span>
                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>

                  {userInfo?.isAdmin && (
                    <Link 
                      to="/admin?tab=categories"
                      className="inline-flex items-center space-x-2 bg-teal-500/20 hover:bg-teal-500/40 text-teal-300 py-3 px-6 rounded-full text-xs font-bold opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-500 border border-teal-500/30"
                    >
                      <FaEdit />
                      <span>EDIT</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
