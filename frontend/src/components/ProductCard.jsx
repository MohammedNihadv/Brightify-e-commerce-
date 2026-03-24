import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { motion } from 'framer-motion';
import { getMediaUrl, handleImageError } from '../utils/mediaUtils';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addToCartHandler = () => {
    dispatch(addToCart({
      product: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.price,
      stock: product.stock,
      qty: 1, // Add 1 item from quick view
    }));
    navigate('/cart');
  };
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="glass group overflow-hidden flex flex-col shadow-lg border border-white/10 rounded-2xl md:hover:shadow-teal-500/20 transition-shadow duration-300"
    >
      <Link to={`/product/${product.slug}`} className="relative block overflow-hidden rounded-t-2xl bg-gradient-to-br from-[#0a1a20] to-[#030712] aspect-[3/4] sm:aspect-auto sm:h-72 border-b border-white/5">
        <img 
          src={getMediaUrl(product.image)} 
          loading="lazy"
          onError={handleImageError}
          alt={product.name} 
          className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" 
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-sm sm:text-lg tracking-wider">OUT OF STOCK</span>
          </div>
        )}
      </Link>
      
      <div className="p-3 sm:p-6 flex flex-col flex-grow">
        <Link to={`/product/${product.slug}`}>
          <h3 className="text-sm sm:text-xl font-bold mb-1 sm:mb-2 group-hover:text-blue-300 transition-colors line-clamp-1">{product.name}</h3>
        </Link>
        <div className="flex items-center space-x-1 sm:space-x-2 text-[10px] sm:text-sm text-gray-300 mb-2 sm:mb-4">
          <span className="bg-white/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full truncate max-w-[80px] sm:max-w-none">{product.category_name || 'Uncategorized'}</span>
          <span>•</span>
          <span className="text-yellow-400 shrink-0">★ {product.reviews?.length > 0 ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1) : 'New'}</span>
        </div>
        
        <div className="mt-auto flex items-center justify-between gap-1">
          <span className="text-sm sm:text-2xl font-black shrink-0">₹{product.price}</span>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={addToCartHandler}
            disabled={product.stock === 0}
            className={`glass-button px-2 sm:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-sm font-bold shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] ${product.stock === 0 ? 'opacity-50 cursor-not-allowed hidden' : ''}`}
          >
            Add
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
