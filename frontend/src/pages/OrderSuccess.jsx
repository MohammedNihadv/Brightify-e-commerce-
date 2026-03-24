import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaCheckCircle } from 'react-icons/fa';
import { clearCartItems } from '../slices/cartSlice';

const OrderSuccess = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearCartItems());
  }, [dispatch]);

  return (
    <div className="animate-fade-in flex items-center justify-center min-h-[70vh]">
      <div className="glass w-full max-w-lg p-10 rounded-3xl text-center">
        <FaCheckCircle className="text-6xl text-emerald-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
        <h1 className="text-4xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">
          ORDER SUCCESSFUL!
        </h1>
        <p className="text-gray-300 text-lg mb-8">
          Thank you for your purchase. Your payment has been verified and your order is being processed.
        </p>
        <div className="flex flex-col space-y-4">
          <Link to="/profile?tab=orders" className="glass-button bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded-xl">
            VIEW YOUR ORDERS
          </Link>
          <Link to="/" className="text-blue-300 hover:text-white transition-colors underline underline-offset-4">
            Return to Store
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
