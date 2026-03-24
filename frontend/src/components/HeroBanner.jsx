import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { fetchBanners } from '../slices/bannerSlice';
import { getMediaUrl, handleImageError } from '../utils/mediaUtils';
import Loader from './Loader';

const HeroBanner = () => {
    const dispatch = useDispatch();
    const { banners, loading } = useSelector((state) => state.banners);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        dispatch(fetchBanners());
    }, [dispatch]);

    useEffect(() => {
        if (banners.length > 1) {
            const timer = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % banners.length);
            }, 6000);
            return () => clearInterval(timer);
        }
    }, [banners]);

    if (loading && banners.length === 0) {
        return (
            <div className="h-[40vh] sm:h-[55vh] md:h-[65vh] glass-dark mb-12 md:mb-16 mt-6 md:mt-8 rounded-2xl md:rounded-[2.5rem] overflow-hidden flex items-center justify-center">
                <Loader message="Preparing your view..." />
            </div>
        );
    }

    if (!Array.isArray(banners) || banners.length === 0) return null;

    const currentBanner = banners[currentIndex % banners.length];
    if (!currentBanner) return null;

  return (
    <div className="relative h-[40vh] sm:h-[55vh] md:h-[65vh] lg:h-[75vh] w-full overflow-hidden mb-12 md:mb-20 mt-6 md:mt-8 rounded-2xl md:rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[#030712] border border-white/5">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentBanner.id}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute inset-0"
                >
                    {/* Banner Image as a Link */}
                    <Link 
                        to={currentBanner.link || '/shop'} 
                        className="absolute inset-0 w-full h-full block group"
                        title={currentBanner.title}
                    >
                        <img 
                            src={getMediaUrl(currentBanner.image)} 
                            alt={currentBanner.title}
                            onError={handleImageError}
                            fetchpriority={currentIndex === 0 ? "high" : "low"}
                            loading={currentIndex === 0 ? "eager" : "lazy"}
                            className="absolute inset-0 w-full h-full object-cover animate-slow-zoom"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500"></div>
                    </Link>
                </motion.div>
            </AnimatePresence>

            {/* Dots Navigation */}
            {banners.length > 1 && (
                <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
                    {banners.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                            className="p-2 transition-all duration-300 group"
                        >
                            <div className={`h-2.5 rounded-full transition-all duration-300 ${
                                idx === currentIndex 
                                ? "w-10 bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]" 
                                : "w-2.5 bg-white/40 group-hover:bg-white/60"
                            }`} />
                        </button>
                    ))}
                </div>
            )}
            {/* Arrow Navigation */}
            {banners.length > 1 && (
                <>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
                        }}
                        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 text-white/70 hover:text-white p-2 md:p-3 rounded-full backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                        aria-label="Previous banner"
                    >
                        <FaChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                    
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrentIndex((prev) => (prev + 1) % banners.length);
                        }}
                        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 text-white/70 hover:text-white p-2 md:p-3 rounded-full backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                        aria-label="Next banner"
                    >
                        <FaChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                </>
            )}
        </div>
    );
};

export default HeroBanner;
