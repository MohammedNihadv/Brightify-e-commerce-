import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUserLock, FaSearch, FaUserCircle, FaSignOutAlt, FaTachometerAlt, FaShoppingBag, FaCog, FaBars, FaTimes } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { userLogout } from '../slices/userSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { getMediaUrl, handleImageError } from '../utils/mediaUtils';
import Logo from './Logo';

const Navbar = () => {
  const cart = useSelector(state => state.cart);
  const { cartItems } = cart;

  const userLogin = useSelector(state => state.user);
  const { userInfo } = userLogin;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (keyword.trim().length > 0) {
        setIsSearching(true);
        try {
          const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/products/?keyword=${keyword}`);
          setSuggestions(data.products.slice(0, 5));
          setShowSuggestions(true);
        } catch (error) {
          console.error(error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
        setIsSearching(false);
      }
    };

    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 150);

    return () => clearTimeout(timer);
  }, [keyword]);

  const logoutHandler = () => {
    dispatch(userLogout());
    setDropdownOpen(false);
    navigate('/login');
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    } else {
      navigate('/shop');
    }
    setMobileMenuOpen(false);
  };

  // Fetch pending orders count for admin notifications
  useEffect(() => {
    const fetchPendingCount = async () => {
      if (userInfo && userInfo.isAdmin) {
        try {
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/orders/`, config);
          const pending = data.filter(order => order.is_paid && !order.is_delivered).length;
          setPendingOrdersCount(pending);
        } catch (error) {
          console.error('Notification fetch error:', error);
        }
      }
    };

    fetchPendingCount();
    const interval = userInfo?.isAdmin ? setInterval(fetchPendingCount, 60000) : null; // Poll every 60s
    return () => { if (interval) clearInterval(interval); };
  }, [userInfo]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cartItemCount = cartItems ? cartItems.reduce((acc, item) => acc + item.qty, 0) : 0;

  return (
    <nav className="glass sticky top-1 md:top-4 z-50 mx-1 md:mx-4 lg:mx-8 mt-1 md:mt-4 border border-white/10 px-3 md:px-8 py-2 md:py-3 transition-all duration-300 rounded-2xl shadow-2xl">
      <div className="flex items-center justify-between max-w-7xl mx-auto gap-4">
        
        {/* Brand logo */}
        <Link to="/" className="flex items-center gap-2 group select-none shrink-0">
          <span className="text-xl md:text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-teal-400 drop-shadow-lg">
            Brightify
          </span>
        </Link>

        {/* Desktop Search Bar */}
        <div className="hidden lg:block flex-1 max-w-md mx-4" ref={searchRef}>
          <form onSubmit={submitHandler} className="relative">
            <input 
              type="text" 
              name="q"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                if (e.target.value.trim().length > 0) {
                  setShowSuggestions(true);
                  setIsSearching(true);
                } else {
                  setShowSuggestions(false);
                }
              }}
              onFocus={() => { if(keyword.trim().length > 0) setShowSuggestions(true); }}
              placeholder="Search products..." 
              className="w-full glass-input py-2 pl-4 pr-10 text-sm"
              autoComplete="off"
            />
            <button type="submit" aria-label="Search" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors">
              <FaSearch />
            </button>
            
            {/* Desktop Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && keyword.trim().length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-[#1a2e35]/95 backdrop-blur-2xl border border-white/20 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden z-[100]"
                >
                  {isSearching ? (
                    <div className="p-4 flex justify-center items-center">
                      <div className="w-5 h-5 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
                    </div>
                  ) : suggestions.length > 0 ? (
                    suggestions.map((p) => (
                      <Link 
                        key={p.id} 
                        to={`/product/${p.slug}`} 
                        onClick={() => { setShowSuggestions(false); setKeyword(''); }} 
                        className="flex items-center gap-3 p-3 hover:bg-white/10 transition-colors border-b border-white/5 last:border-b-0"
                      >
                        <img 
                          src={getMediaUrl(p.image)} 
                          alt={p.name} 
                          onError={handleImageError}
                          className="w-10 h-10 object-cover rounded-md" 
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-bold truncate">{p.name}</p>
                          <p className="text-teal-400 text-xs font-bold">₹{p.price}</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-400">No products found for "{keyword}"</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-3 lg:gap-5 text-sm font-medium shrink-0">
          <Link to="/shop" className="hover:text-blue-300 transition-colors">Shop</Link>
          <Link to="/categories" className="hover:text-blue-300 transition-colors">Categories</Link>
          
          <Link to="/cart" aria-label={`View shopping cart, ${cartItemCount} items`} className="relative group p-2">
            <FaShoppingCart className="text-xl group-hover:text-blue-300 transition-colors" />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-[10px] rounded-full h-4 w-4 flex items-center justify-center border border-white/20 shadow-sm font-bold">
                {cartItemCount}
              </span>
            )}
          </Link>
          
          {userInfo ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 glass-button py-1.5 px-3 hover:bg-white/10 transition-all"
              >
                <FaUserCircle className="text-lg" />
                <span className="max-w-[70px] truncate">{userInfo.name.split(' ')[0]}</span>
                <svg className={`w-3 h-3 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-56 bg-[#1a2e35] border border-white/20 rounded-2xl shadow-2xl py-2 z-[100] overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-white/20">
                      <p className="text-white font-bold text-sm truncate">{userInfo.name}</p>
                      <p className="text-gray-400 text-xs truncate">{userInfo.email}</p>
                    </div>
                    
                    {userInfo.isAdmin && (
                      <Link to={pendingOrdersCount > 0 ? '/dashboard?tab=orders' : '/dashboard'} onClick={() => setDropdownOpen(false)} className="flex items-center justify-between w-full px-4 py-3 text-sm hover:bg-orange-500/25 text-orange-300 hover:text-orange-200 transition-colors">
                        <div className="flex items-center gap-3">
                          <FaTachometerAlt />
                          <span className="font-medium">Dashboard</span>
                        </div>
                        {pendingOrdersCount > 0 && (
                          <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse-glow">
                            {pendingOrdersCount} New
                          </span>
                        )}
                      </Link>
                    )}
                    <Link to="/profile?tab=settings" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-white/10 text-gray-100 hover:text-white transition-colors">
                      <FaUserCircle />
                      <span className="font-medium">Profile</span>
                    </Link>
                    <Link to="/profile?tab=orders" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-white/10 text-gray-100 hover:text-white transition-colors">
                      <FaShoppingBag />
                      <span className="font-medium">My Orders</span>
                    </Link>
                    <div className="border-t border-white/15 mt-1 pt-1">
                      <button 
                        onClick={logoutHandler}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-red-500/25 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <FaSignOutAlt />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="flex items-center space-x-1 glass-button py-1.5 px-3">
              <FaUserLock />
              <span>Login</span>
            </Link>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="flex lg:hidden items-center gap-2">
          <Link to="/shop" className="text-xs font-semibold text-gray-200 hover:text-white transition-colors">Shop</Link>
          <span className="text-gray-500 text-[8px]">•</span>
          <Link to="/categories" className="text-xs font-semibold text-gray-200 hover:text-white transition-colors">Categories</Link>
          <Link to="/cart" aria-label={`View shopping cart, ${cartItemCount} items`} className="relative p-1.5 ml-1">
            <FaShoppingCart className="text-base" />
            {cartItemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-[8px] rounded-full h-3.5 w-3.5 flex items-center justify-center font-bold">
                {cartItemCount}
              </span>
            )}
          </Link>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="text-white text-base p-1 active:scale-90 transition-transform"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Persistent Mobile Search */}
      <div className="lg:hidden pt-1.5 w-full relative z-[100]">
        <div ref={mobileSearchRef}>
          <form onSubmit={submitHandler} className="relative rounded-lg overflow-visible">
          <input 
            type="text" 
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              if (e.target.value.trim().length > 0) {
                setShowSuggestions(true);
                setIsSearching(true);
              } else {
                setShowSuggestions(false);
              }
            }}
            onFocus={() => { if(keyword.trim().length > 0) setShowSuggestions(true); }}
            placeholder="Search products..." 
            className="w-full glass bg-white/5 border-white/10 rounded-lg py-2 pl-3 pr-10 text-xs text-white focus:outline-none focus:border-blue-400"
            autoComplete="off"
          />
          <button type="submit" aria-label="Search" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-blue-300 text-sm">
            <FaSearch />
          </button>

          {/* Mobile Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && keyword.trim().length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-1.5 bg-[#1a2e35] border border-white/20 rounded-xl shadow-2xl overflow-hidden z-[100]"
              >
                {isSearching ? (
                  <div className="p-4 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-teal-400"></div>
                  </div>
                ) : suggestions.length > 0 ? (
                  suggestions.map((p) => (
                    <Link 
                      key={p.id} 
                      to={`/product/${p.slug}`} 
                      onClick={() => { setShowSuggestions(false); setKeyword(''); }} 
                      className="flex items-center gap-2.5 p-2.5 hover:bg-white/10 transition-colors border-b border-white/5 last:border-b-0"
                    >
                      <img 
                        src={getMediaUrl(p.image)} 
                        alt={p.name} 
                        onError={handleImageError}
                        className="w-8 h-8 object-cover rounded-md" 
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-bold truncate">{p.name}</p>
                        <p className="text-teal-400 text-[10px] font-bold">₹{p.price}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-3 text-center text-xs text-gray-400">No products found for "{keyword}"</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden mt-2 pt-3 border-t border-white/10 flex flex-col gap-2 relative z-[100]"
          >
            {userInfo ? (
              <div className="rounded-xl border border-white/5 bg-white/5 overflow-hidden">
                {/* User Info Row */}
                <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-white/5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white text-xs font-black shrink-0">
                    {userInfo.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-bold text-xs truncate">{userInfo.name}</p>
                    <p className="text-gray-400 text-[10px] truncate">{userInfo.email}</p>
                  </div>
                </div>
                {/* Menu Items */}
                <div className="py-1">
                  {userInfo.isAdmin && (
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2 text-xs text-orange-400 font-semibold hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <FaTachometerAlt className="text-[10px]" /> Dashboard
                      </div>
                      {pendingOrdersCount > 0 && (
                        <span className="bg-orange-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full animate-pulse-glow">
                          {pendingOrdersCount} NEW
                        </span>
                      )}
                    </Link>
                  )}
                  <Link to="/profile?tab=settings" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-xs text-gray-200 font-semibold hover:bg-white/5 transition-colors">
                    <FaUserCircle className="text-[10px]" /> My Account
                  </Link>
                  <Link to="/profile?tab=orders" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-xs text-gray-200 font-semibold hover:bg-white/5 transition-colors">
                    <FaShoppingBag className="text-[10px]" /> My Orders
                  </Link>
                  <button onClick={logoutHandler} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 font-semibold hover:bg-white/5 transition-colors border-t border-white/5 mt-1">
                    <FaSignOutAlt className="text-[10px]" /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block text-center rounded-xl bg-blue-500/15 border border-blue-500/20 text-blue-300 py-2.5 text-xs font-bold hover:bg-blue-500/25 transition-colors">
                Login / Sign Up
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
