import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../slices/cartSlice';
import { FaTruck, FaShieldAlt, FaMapMarkerAlt, FaPhoneAlt, FaBox } from 'react-icons/fa';

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
                  ? 'bg-blue-500 text-white ring-4 ring-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.4)]' 
                  : 'bg-white/5 text-gray-500 border border-white/10'
            }`}>
              {step.num < current ? (
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              ) : step.num}
            </div>
            <span className={`text-[9px] md:text-xs font-bold mt-1.5 ${
              step.num <= current ? 'text-blue-300' : 'text-gray-600'
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

const Shipping = () => {
  const cart = useSelector(state => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');
  const [phone, setPhone] = useState(shippingAddress?.phone || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validatePhone = (num) => {
    return /^\d{10}$/.test(num);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhone(value);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!validatePhone(phone)) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    dispatch(saveShippingAddress({ address, city, postalCode, country, phone }));
    navigate('/payment');
  };

  return (
    <div className="animate-fade-in flex items-center justify-center min-h-[70vh] py-6 md:py-12 px-3 md:px-4">
      <div className="w-full max-w-lg space-y-4 md:space-y-6">
        
        {/* Main Card */}
        <div className="glass p-5 md:p-8 rounded-2xl md:rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-teal-400 to-blue-500" />
          
          <CheckoutSteps current={1} />
          
          <h1 className="text-xl md:text-3xl font-bold mb-1 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-teal-200">
            Delivery Address
          </h1>
          <p className="text-center text-gray-400 text-[10px] md:text-xs mb-5 md:mb-8 font-medium">Where should we deliver your order?</p>
          
          <form onSubmit={submitHandler} className="space-y-3 md:space-y-4">
            <div>
              <label className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-gray-400 capitalize tracking-wide mb-1.5 ml-1">
                <FaMapMarkerAlt className="text-blue-400 text-[8px] md:text-[10px]" /> Address
              </label>
              <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} className="glass-input w-full p-3 md:p-4 text-white text-sm" placeholder="Full street address" />
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">City</label>
                <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} className="glass-input w-full p-3 md:p-4 text-white text-sm" placeholder="City" />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                  <FaPhoneAlt className="text-blue-400 text-[8px] md:text-[10px]" /> Phone
                </label>
                <input 
                  type="tel" 
                  required 
                  value={phone} 
                  onChange={handlePhoneChange} 
                  className="glass-input w-full p-3 md:p-4 text-white text-sm" 
                  placeholder="10-digit number" 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">PIN Code</label>
                <input type="text" required value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="glass-input w-full p-3 md:p-4 text-white text-sm" placeholder="000000" />
              </div>
              <div>
                <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Country</label>
                <input type="text" required value={country} onChange={(e) => setCountry(e.target.value)} className="glass-input w-full p-3 md:p-4 text-white text-sm" placeholder="India" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 md:gap-4 mt-4 md:mt-6 pt-3 md:pt-4 border-t border-white/5">
              <button 
                type="button"
                onClick={() => navigate('/cart')}
                className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-bold py-2.5 md:py-3.5 rounded-xl transition-all duration-300 border border-white/5 text-xs md:text-sm"
              >
                ← Back
              </button>
              <button type="submit" className="flex-[2] bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-2.5 md:py-3.5 rounded-xl transition-all duration-300 shadow-xl transform active:scale-95 text-sm md:text-base tracking-normal">
                Continue to Payment →
              </button>
            </div>
          </form>
        </div>

        {/* Delivery Info Badges */}
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          <div className="glass p-2.5 md:p-4 rounded-xl md:rounded-2xl text-center">
            <FaTruck className="text-teal-400 mx-auto mb-1 md:mb-2 text-sm md:text-lg" />
            <p className="text-[9px] md:text-xs font-bold text-white">Free Delivery</p>
            <p className="text-[8px] md:text-[10px] text-gray-400 mt-0.5">On all orders</p>
          </div>
          <div className="glass p-2.5 md:p-4 rounded-xl md:rounded-2xl text-center">
            <FaBox className="text-blue-400 mx-auto mb-1 md:mb-2 text-sm md:text-lg" />
            <p className="text-[9px] md:text-xs font-bold text-white">3-5 Days</p>
            <p className="text-[8px] md:text-[10px] text-gray-400 mt-0.5">Estimated delivery</p>
          </div>
          <div className="glass p-2.5 md:p-4 rounded-xl md:rounded-2xl text-center">
            <FaShieldAlt className="text-emerald-400 mx-auto mb-1 md:mb-2 text-sm md:text-lg" />
            <p className="text-[9px] md:text-xs font-bold text-white">Secure</p>
            <p className="text-[8px] md:text-[10px] text-gray-400 mt-0.5">SSL encrypted</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
