import { Link } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';

const OrderFailed = () => {
  return (
    <div className="animate-fade-in flex items-center justify-center min-h-[70vh]">
      <div className="glass w-full max-w-lg p-10 rounded-3xl text-center border-red-500/30">
        <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
        <h1 className="text-4xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-400">
          PAYMENT FAILED
        </h1>
        <p className="text-gray-300 text-lg mb-8">
          Unfortunately, we could not verify your payment. Your order has not been placed.
        </p>
        <div className="flex flex-col space-y-4">
          <Link to="/cart" className="glass-button bg-red-500/20 hover:bg-red-500/40 text-red-200 border-red-500/50 font-bold py-3 rounded-xl">
            RETURN TO CART
          </Link>
          <Link to="/shipping" className="text-blue-300 hover:text-white transition-colors underline underline-offset-4">
            Try a different payment method
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderFailed;
