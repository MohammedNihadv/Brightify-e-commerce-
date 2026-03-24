import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addToCart } from '../slices/cartSlice';
import Breadcrumb from '../components/Breadcrumb';
import Loader from '../components/Loader';
import { motion } from 'framer-motion';
import { getMediaUrl, handleImageError } from '../utils/mediaUtils';

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState({});
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const { userInfo } = useSelector((state) => state.user);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/products/${slug}/`);
      setProduct(data);
      if (data.category?.id) {
        fetchRelatedProducts(data.category.id, data.id);
      }
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (categoryId, currentProductId) => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/products/?category=${categoryId}`);
      setRelatedProducts(data.products.filter(p => p.id !== currentProductId).slice(0, 4));
    } catch (err) {
      console.error('Related products fetch error:', err);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitMessage(null);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.post(
        `${import.meta.env.VITE_API_URL || ''}/api/products/reviews/${product.id}/`,
        { rating, comment },
        config
      );
      setSubmitLoading(false);
      setSubmitMessage('Review submitted successfully!');
      setRating(0);
      setComment('');
      fetchProduct();
    } catch (err) {
      setSubmitLoading(false);
      setSubmitMessage(err.response?.data?.detail || err.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({
      product: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.price,
      stock: product.stock,
      qty: Number(qty),
    }));
    navigate('/cart');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0c161a]"><Loader message="Revealing Details..." /></div>;
  if (error) return <div className="glass bg-red-500/20 border-red-500/50 p-6 text-center rounded-xl"><h3 className="text-2xl font-bold mb-2">Error</h3><p>{error}</p></div>;

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: product.name || 'Loading...', path: `/product/${slug}` }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto py-4 md:py-8 px-3 md:px-4"
    >
      <div className="flex flex-wrap justify-between items-center mb-4 md:mb-8 gap-2 md:gap-4">
        <Breadcrumb items={breadcrumbItems} />
        <Link to="/shop" className="glass-button inline-block px-4 md:px-6 py-1.5 md:py-2 text-xs md:text-sm">
          &#8592; Back
        </Link>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 mt-2 md:mt-6">
        
        {/* Left Column: Product Image */}
        <div className="lg:w-3/5 flex flex-col gap-4 md:gap-6">
          <div className="glass rounded-xl md:rounded-[3rem] overflow-hidden p-4 md:p-8 shadow-2xl relative group h-[300px] sm:h-[450px] md:h-[60vh] lg:h-[75vh] max-h-[850px] flex items-center justify-center bg-[#030712] border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <img 
              src={getMediaUrl(product.image)}
              onError={handleImageError}
              alt={product.name}
              className="max-w-full max-h-[260px] sm:max-h-[330px] md:max-h-[560px] lg:max-h-[660px] object-contain rounded-lg md:rounded-[2rem] transform transition-transform duration-700 group-hover:scale-105" 
            />
          </div>
        </div>

        {/* Right Column: Information & Actions */}
        <div className="lg:w-2/5 flex flex-col">
          <div className="mb-4 md:mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black mb-2 md:mb-3 tracking-tight drop-shadow-md leading-tight text-white">{product.name}</h1>
            <div className="text-yellow-400 font-bold tracking-widest text-[10px] md:text-sm mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
              <span className="bg-yellow-400/10 text-yellow-400 px-2 md:px-3 py-0.5 md:py-1 rounded-full border border-yellow-400/20">
                {product.reviews?.length > 0 ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1) : 'NEW'} ★
              </span>
              <span className="text-gray-400 font-medium">|</span>
              <span className="text-gray-400 font-medium tracking-normal capitalize truncate">{product.category?.name || 'Lighting Solution'}</span>
            </div>
            
            <div className="flex items-baseline gap-3 md:gap-4 mb-6 md:mb-8">
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-300">₹{product.price}</span>
              <span className={`text-[10px] md:text-sm font-bold uppercase tracking-widest ${product.stock > 0 ? 'text-teal-400' : 'text-red-400'}`}>
                {product.stock > 0 ? `${product.stock} Units In Stock` : 'Currently Sold Out'}
              </span>
            </div>
          </div>

          {/* Action Box */}
          <div className="glass p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white/10 shadow-xl mb-6 md:mb-8">
            {product.stock > 0 && (
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] md:text-xs">Quantity</span>
                <select 
                  className="glass-select px-3 md:px-4 py-1.5 md:py-2 w-20 md:w-24 text-sm md:text-base text-center font-bold"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                >
                  {[...Array(Math.max(0, Math.floor(Number(product.stock) || 0))).keys()].map((x) => (
                    <option key={x + 1} value={x + 1} className="text-black">
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button 
              onClick={addToCartHandler}
              disabled={product.stock === 0}
              className={`w-full py-3 md:py-5 text-xs md:text-lg font-black tracking-widest rounded-xl md:rounded-2xl transition-all duration-300 shadow-xl md:shadow-2xl ${
                product.stock === 0 
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed border' 
                  : 'bg-white text-black hover:bg-gray-100 transform hover:-translate-y-1 hover:shadow-white/20'
              }`}
            >
              {product.stock === 0 ? 'UNAVAILABLE' : 'ADD TO BAG'}
            </button>
            <p className="text-center text-gray-500 text-[9px] md:text-[10px] mt-3 md:mt-4 uppercase tracking-tighter">Premium delivery & setup included</p>
          </div>
          
          {/* Tabs for extra info */}
          <div className="flex p-1 glass rounded-2xl mb-6 border border-white/5">
            <button 
              onClick={() => setActiveTab('description')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 ${activeTab === 'description' ? 'bg-white/10 text-white shadow-md' : 'text-gray-500 hover:text-white'}`}
            >
              Info
            </button>
            <button 
              onClick={() => setActiveTab('specs')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 ${activeTab === 'specs' ? 'bg-white/10 text-white shadow-md' : 'text-gray-500 hover:text-white'}`}
            >
              Specs
            </button>
          </div>

          <div className="text-gray-400 leading-relaxed text-sm md:text-base mb-8 px-2">
            {activeTab === 'description' && product.description}
            {activeTab === 'specs' && (
              <div className="space-y-4">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500">Collection</span>
                  <span className="text-white font-medium">{product.category?.name || 'Brightify Originals'}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500">Material</span>
                  <span className="text-white font-medium">Premium Grade</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section at Bottom */}
      <div className="mt-12 md:mt-24 border-t border-white/10 pt-12">
        <h2 className="text-3xl md:text-5xl font-black mb-12 tracking-tight">Customer Experiences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {product.reviews?.length === 0 ? (
            <div className="col-span-full glass p-12 text-center text-gray-500 rounded-3xl border-dashed">
              No testimonials yet. Share your experience with this light.
            </div>
          ) : (
            product.reviews?.map((review) => (
              <div key={review.id} className="glass p-8 rounded-3xl border border-white/5 shadow-xl">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-white font-bold text-xl">{review.name}</h4>
                    <p className="text-xs text-teal-400 font-bold uppercase tracking-widest mt-1">Verified Client</p>
                  </div>
                  <div className="flex items-center space-x-1 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
                    <span className="text-yellow-400 font-black text-sm">{review.rating}</span>
                    <span className="text-yellow-400 text-xs">★</span>
                  </div>
                </div>
                <p className="text-gray-300 leading-loose italic text-lg">"{review.comment}"</p>
                <p className="text-gray-500 text-xs mt-6 font-medium">{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
        
        {/* Review Form - Compact */}
        <div className="mt-12 max-w-2xl">
          {userInfo ? (
            <form onSubmit={submitHandler} className="glass p-8 rounded-3xl border border-white/10">
              <h3 className="text-2xl font-bold mb-6">Write a Review</h3>
              <div className="space-y-6">
                <select 
                  required
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="glass-select w-full px-4 py-3"
                >
                  <option value="" className="text-black">Select Stars...</option>
                  {[5,4,3,2,1].map(n => <option key={n} value={n} className="text-black">{n} Stars - {n === 5 ? 'Perfect' : n === 1 ? 'Poor' : 'Good'}</option>)}
                </select>
                <textarea 
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="glass-input w-full px-4 py-4 placeholder-gray-500 text-white"
                  placeholder="How does it light up your space?"
                ></textarea>
                <button 
                  type="submit"
                  disabled={submitLoading}
                  className="glass-button w-full py-4 font-bold text-teal-300 hover:text-white transition-all shadow-lg"
                >
                  {submitLoading ? 'SENDING...' : 'PUBLISH REVIEW'}
                </button>
              </div>
            </form>
          ) : (
            <div className="glass p-8 text-center rounded-3xl border border-dashed border-white/20">
              <p className="text-gray-400 mb-4">Log in to share your Brightify experience</p>
              <Link to="/login" className="text-teal-300 font-black tracking-widest hover:text-white transition-all uppercase text-sm">Join the Conversation</Link>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 md:mt-32 border-t border-white/5 pt-16 mb-12">
          <div className="flex items-center justify-between mb-10 px-2">
            <div>
              <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight capitalize">You Might Also Love</h2>
              <p className="text-gray-500 text-xs md:text-sm mt-1 uppercase tracking-widest">Handpicked recommendations for your style</p>
            </div>
            <Link to="/shop" className="text-teal-400 hover:text-white transition-all text-xs md:text-sm font-bold border-b border-teal-400/30 pb-1">Review All Collections</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {relatedProducts.map(rel => (
              <Link key={rel.id} to={`/product/${rel.slug}`} className="group block">
                <div className="glass aspect-[3/4] rounded-3xl overflow-hidden mb-4 border border-white/5 group-hover:border-teal-400/30 transition-all relative">
                    <img 
                      src={getMediaUrl(rel.image)} 
                      alt={rel.name} 
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" 
                      onError={handleImageError}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <span className="bg-white text-black px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-tighter">View Masterpiece</span>
                    </div>
                </div>
                <h3 className="text-white font-bold text-sm md:text-base group-hover:text-teal-300 transition-colors line-clamp-1 truncate">{rel.name}</h3>
                <p className="text-teal-400 font-black text-xs md:text-sm mt-1">₹{rel.price}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductDetails;
