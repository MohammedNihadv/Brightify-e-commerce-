import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaCreditCard, FaShieldAlt, FaLock, FaCheck } from 'react-icons/fa';

const CheckoutSteps = ({ current }) => {
  const steps = [
    { label: 'Shipping', num: 1 },
    { label: 'Payment', num: 2 },
    { label: 'Confirm', num: 3 },
  ];
  return (
    <div className="flex items-center justify-center gap-0 mb-6 md:mb-8">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-black transition-all duration-300 ${
              step.num < current 
                ? 'bg-teal-400 text-[#0f2027]' 
                : step.num === current 
                  ? 'bg-teal-500 text-white ring-4 ring-teal-500/20 shadow-[0_0_20px_rgba(20,184,166,0.4)]' 
                  : 'bg-white/5 text-gray-500 border border-white/10'
            }`}>
              {step.num < current ? (
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              ) : step.num}
            </div>
            <span className={`text-[9px] md:text-xs font-bold mt-1.5 ${
              step.num <= current ? 'text-teal-300' : 'text-gray-600'
            }`}>{step.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-8 md:w-16 h-0.5 mx-1 md:mx-2 rounded-full mb-5 ${
              step.num < current ? 'bg-teal-400' : 'bg-white/10'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
};

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('Razorpay');

  const cart = useSelector(state => state.cart);
  const { shippingAddress } = cart;

  const navigate = useNavigate();

  useEffect(() => {
    if (!cart.cartItems || cart.cartItems.length === 0) {
      navigate('/cart');
    }
    else if (!shippingAddress || !shippingAddress.address) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress, cart.cartItems]);

  const submitHandler = (e) => {
    e.preventDefault();
    localStorage.setItem('paymentMethod', paymentMethod);
    navigate('/placeorder');
  };

  const itemsTotal = cart.cartItems?.reduce((acc, item) => acc + item.price * item.qty, 0) || 0;

  return (
    <div className="animate-fade-in flex items-center justify-center min-h-[70vh] py-6 md:py-12 px-3 md:px-4">
      <div className="w-full max-w-lg space-y-4 md:space-y-6">
        
        {/* Main Card */}
        <div className="glass p-5 md:p-8 rounded-2xl md:rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-500" />
          
          <CheckoutSteps current={2} />
          
          <h1 className="text-xl md:text-3xl font-bold mb-1 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-200">
            Payment Method
          </h1>
          <p className="text-center text-gray-400 text-[10px] md:text-xs mb-5 md:mb-8 font-medium">Choose how you'd like to pay</p>
          
          <form onSubmit={submitHandler} className="space-y-4 md:space-y-6">
            
            {/* Payment Option */}
            <label className={`flex items-center p-4 md:p-5 rounded-xl md:rounded-2xl cursor-pointer transition-all duration-300 border ${
              paymentMethod === 'Razorpay' 
                ? 'border-teal-400/50 bg-teal-500/10 shadow-[0_0_20px_rgba(20,184,166,0.15)]' 
                : 'border-white/10 bg-white/5 opacity-70 hover:opacity-100'
            }`}>
              <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                paymentMethod === 'Razorpay' ? 'border-teal-400 bg-teal-400' : 'border-gray-500'
              }`}>
                {paymentMethod === 'Razorpay' && <FaCheck className="text-[#0f2027] text-[8px] md:text-[10px]" />}
              </div>
              <input 
                type="radio" 
                id="Razorpay" 
                name="paymentMethod" 
                value="Razorpay" 
                className="hidden"
                checked={paymentMethod === 'Razorpay'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <div className="ml-3 md:ml-4 flex-1">
                <div className="flex items-center gap-2 md:gap-3">
                  <FaCreditCard className="text-teal-400 text-sm md:text-lg" />
                  <span className="text-sm md:text-lg font-bold text-white">Razorpay</span>
                </div>
                <p className="text-[10px] md:text-xs text-gray-300 mt-1 ml-6 md:ml-8">Cards, UPI, NetBanking & Wallets</p>
              </div>
              <FaShieldAlt className="text-teal-400/30 text-lg md:text-2xl shrink-0" />
            </label>

            {/* Order Quick Summary */}
            <div className="bg-white/5 rounded-xl p-3 md:p-4 border border-white/5">
              <div className="flex justify-between items-center text-xs md:text-sm">
                <span className="text-gray-300">{cart.cartItems?.length || 0} items in cart</span>
                <span className="font-bold text-white text-sm md:text-base">₹{itemsTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] md:text-xs mt-1.5">
                <span className="text-gray-400">Shipping</span>
                <span className="text-emerald-400 font-bold">FREE</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 md:gap-4 pt-2 md:pt-3 border-t border-white/5">
              <button 
                type="button"
                onClick={() => navigate('/shipping')}
                className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-bold py-2.5 md:py-3.5 rounded-xl transition-all duration-300 border border-white/5 text-xs md:text-sm"
              >
                ← Back
              </button>
              <button type="submit" className="flex-[2] bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold py-2.5 md:py-3.5 rounded-xl transition-all duration-300 shadow-xl transform active:scale-95 text-sm md:text-base tracking-normal">
                Review Order →
              </button>
            </div>
          </form>
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-4 md:gap-6 py-2">
          <div className="flex items-center gap-1.5 text-gray-400">
            <FaLock className="text-[10px] md:text-xs text-emerald-400/60" />
            <span className="text-[9px] md:text-[11px] font-bold">256-bit SSL</span>
          </div>
          <div className="w-px h-3 bg-white/10"></div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <FaShieldAlt className="text-[10px] md:text-xs text-emerald-400/60" />
            <span className="text-[9px] md:text-[11px] font-bold">Secure Payment</span>
          </div>
          <div className="w-px h-3 bg-white/10"></div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <FaCreditCard className="text-[10px] md:text-xs text-emerald-400/60" />
            <span className="text-[9px] md:text-[11px] font-bold">RBI Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
