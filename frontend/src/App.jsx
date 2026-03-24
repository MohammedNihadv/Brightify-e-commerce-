import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from './components/Loader';
import { getMediaUrl, handleImageError } from './utils/mediaUtils';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Retry wrapper for lazy imports — handles stale Vite chunk hashes after redeployment
const lazyRetry = (importFn) => lazy(() =>
  importFn().catch(() => {
    // If chunk fails to load (stale hash), reload page ONCE to get fresh HTML
    const hasReloaded = sessionStorage.getItem('chunk_reload');
    if (!hasReloaded) {
      sessionStorage.setItem('chunk_reload', '1');
      window.location.reload();
      return new Promise(() => {}); // Never resolves — page will reload
    }
    sessionStorage.removeItem('chunk_reload');
    // If already reloaded once, let ErrorBoundary handle it
    return importFn();
  })
);

// Lazy load pages for better performance
const Home = lazyRetry(() => import('./pages/Home'));
const ProductDetails = lazyRetry(() => import('./pages/ProductDetails'));
const Cart = lazyRetry(() => import('./pages/Cart'));
const Login = lazyRetry(() => import('./pages/Login'));
const Register = lazyRetry(() => import('./pages/Register'));
const Shipping = lazyRetry(() => import('./pages/Shipping'));
const Payment = lazyRetry(() => import('./pages/Payment'));
const PlaceOrder = lazyRetry(() => import('./pages/PlaceOrder'));
const OrderSuccess = lazyRetry(() => import('./pages/OrderSuccess'));
const OrderFailed = lazyRetry(() => import('./pages/OrderFailed'));
const Profile = lazyRetry(() => import('./pages/Profile'));
const OrderDetails = lazyRetry(() => import('./pages/OrderDetails'));
const AdminDashboard = lazyRetry(() => import('./pages/AdminDashboard'));
const About = lazyRetry(() => import('./pages/About'));
const Contact = lazyRetry(() => import('./pages/Contact'));
const PrivacyPolicy = lazyRetry(() => import('./pages/PrivacyPolicy'));
const Terms = lazyRetry(() => import('./pages/Terms'));
const Shop = lazyRetry(() => import('./pages/Shop'));
const Categories = lazyRetry(() => import('./pages/Categories'));

const PageLoader = () => (
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#0c161a]">
    <Loader message="Loading Brightify..." />
  </div>
);

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:slug" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/placeorder" element={<PlaceOrder />} />
                <Route path="/order/success" element={<OrderSuccess />} />
                <Route path="/order/failed" element={<OrderFailed />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders/:id" element={<OrderDetails />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/search/:keyword" element={<Shop />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/category/:categorySlug" element={<Shop />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </div>
    </Router>
  );
}

export default App;
