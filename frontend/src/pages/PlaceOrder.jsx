import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { clearCartItems } from '../slices/cartSlice';
import { userLogout } from '../slices/userSlice';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const userLoginState = useSelector((state) => state.user);
  const { userInfo } = userLoginState;

  const [loading, setLoading] = useState(false);

  const paymentMethod = localStorage.getItem('paymentMethod') || 'Razorpay';

  const itemsList = cart.cartItems || [];
  const itemsPrice = itemsList.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);
  const shippingPrice = "0.00";
  const totalPrice = (Number(itemsPrice)).toFixed(2);

  useEffect(() => {
    // Redirect away if completely empty
    if (!cart.cartItems || cart.cartItems.length === 0) {
      navigate('/cart');
    } else if (!cart.shippingAddress || !cart.shippingAddress.address || !cart.shippingAddress.phone) {
      navigate('/shipping');
    } else if (!paymentMethod) {
      navigate('/payment');
    }
  }, [navigate, cart.shippingAddress, paymentMethod, cart.cartItems]);

  const placeOrderHandler = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL || ''}/api/orders/add/`,
        {
          orderItems: itemsList,
          shippingAddress: cart.shippingAddress || {},
          paymentMethod: paymentMethod,
          itemsPrice: itemsPrice,
          shippingPrice: shippingPrice,
          taxPrice: 0,
          totalPrice: totalPrice,
        },
        config
      );

      if (paymentMethod === 'Razorpay') {
        const { data: razorpayData } = await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/payments/create/${data.id}/`, {}, config);
        startRazorpay(razorpayData, data.id, config);
      } else {
        navigate(`/order/success`);
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 401) {
        dispatch(userLogout());
        alert("Your session has expired or is invalid. Please log in again.");
        navigate('/login?redirect=cart');
      } else {
        alert("Error placing order: " + (error.response?.data?.detail || error.message));
      }
    }
  };

  const startRazorpay = (razorpayData, orderId, config) => {
    const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY || "rzp_live_STOIwgXU0KiJN2";
    
    // Check for mock key
    if (RAZORPAY_KEY === 'rzp_test_mock_key_id') {
      simulateSuccess(orderId, config);
      return;
    }

    const options = {
      key: RAZORPAY_KEY,
      amount: razorpayData.amount,
      currency: "INR",
      name: "Brightify",
      description: "Transaction for Order #" + orderId,
      order_id: razorpayData.id,
      handler: async function (response) {
        try {
          setLoading(true);
          await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/payments/verify/${orderId}/`, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          }, config);
          
          navigate(`/order/success`);
        } catch (err) {
          navigate(`/order/failed`);
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name: userInfo.name,
        email: userInfo.email,
      },
      theme: { color: "#3B82F6" },
      modal: {
        ondismiss: function() {
          setLoading(false);
        }
      }
    };

    try {
      if (!window.Razorpay) {
        throw new Error("Razorpay gateway not loaded");
      }
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment system failed to launch. Please try again.");
      setLoading(false);
    }
  };

  const simulateSuccess = async (orderId, config) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/payments/verify/${orderId}/`, {
        razorpay_order_id: "mock_order_id",
        razorpay_payment_id: "mock_payment_id_123",
      }, config);
      navigate(`/order/success`);
    } catch (err) {
      navigate(`/order/failed`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // dynamically load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    }
  }, []);

  return (
    <div className="animate-fade-in max-w-6xl mx-auto py-4 md:py-8 px-3 md:px-0">
      {/* Visual Checkout Steps */}
      <div className="flex items-center justify-center gap-0 mb-6 md:mb-10">
        {[
          { label: 'Shipping', num: 1 },
          { label: 'Payment', num: 2 },
          { label: 'Confirm', num: 3 },
        ].map((step, i) => (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-black transition-all duration-300 ${
                step.num < 3 
                  ? 'bg-teal-400 text-[#0f2027]' 
                  : 'bg-purple-500 text-white ring-4 ring-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
              }`}>
                {step.num < 3 ? (
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                ) : step.num}
              </div>
              <span className="text-[9px] md:text-xs font-bold mt-1.5 text-purple-300">{step.label}</span>
            </div>
            {i < 2 && (
              <div className="w-8 md:w-16 h-0.5 mx-1 md:mx-2 rounded-full mb-5 bg-teal-400" />
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
        {/* Left Side: Order details */}
        <div className="lg:w-2/3 space-y-3 md:space-y-8">
          <div className="glass rounded-2xl md:rounded-3xl p-4 md:p-8">
            <h2 className="text-lg md:text-2xl font-bold mb-2 md:mb-4 pb-2 md:pb-4 border-b border-white/10 text-blue-300">Shipping</h2>
            <p className="text-gray-200 text-xs md:text-lg">
              <strong>Address: </strong>
              {cart.shippingAddress?.address}, {cart.shippingAddress?.city},{' '}
              {cart.shippingAddress?.postalCode}, {cart.shippingAddress?.country}
            </p>
            {cart.shippingAddress?.phone && (
              <p className="text-gray-200 text-xs md:text-lg mt-1 md:mt-2">
                <strong>Phone: </strong>{cart.shippingAddress.phone}
              </p>
            )}
          </div>

          <div className="glass rounded-2xl md:rounded-3xl p-4 md:p-8">
            <h2 className="text-lg md:text-2xl font-bold mb-2 md:mb-4 pb-2 md:pb-4 border-b border-white/10 text-teal-300">Payment</h2>
            <p className="text-gray-200 text-xs md:text-lg">
              <strong>Method: </strong>
              {paymentMethod}
            </p>
          </div>

          <div className="glass rounded-2xl md:rounded-3xl p-4 md:p-8">
            <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-6 pb-2 md:pb-4 border-b border-white/10 text-purple-300">Items</h2>
            {!itemsList || itemsList.length === 0 ? (
              <div className="text-red-300 text-sm">Your cart is empty</div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                {itemsList.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 md:gap-4">
                    <img src={item.image?.startsWith('http') ? item.image : `${import.meta.env.VITE_API_URL || ''}${item.image}`}  alt={item.name} className="w-10 h-10 md:w-16 md:h-16 object-cover rounded-lg md:rounded-xl shrink-0" />
                    <Link to={`/product/${item.product}`} className="hover:text-blue-300 line-clamp-1 text-xs md:text-base flex-1 min-w-0">{item.name}</Link>
                    <div className="font-bold whitespace-nowrap text-xs md:text-base shrink-0">
                      {item.qty} x ₹{item.price} = ₹{(item.qty * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:w-1/3">
          <div className="glass rounded-2xl md:rounded-3xl p-4 md:p-8 sticky top-24">
            <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-6 pb-2 md:pb-4 border-b border-white/10">Summary</h2>
            
            <div className="space-y-3 md:space-y-4 text-gray-200 text-sm md:text-base">
              <div className="flex justify-between">
                <span>Items</span>
                <span>₹{itemsPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-emerald-400 font-bold">FREE</span>
              </div>
              <div className="flex justify-between pt-3 md:pt-4 border-t border-white/10 text-white font-black text-lg md:text-2xl">
                <span>Total</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:gap-4 mt-4 md:mt-8">
              <button
                onClick={placeOrderHandler}
                disabled={itemsList.length === 0 || loading}
                className="w-full bg-gradient-to-r from-blue-500 hover:from-blue-600 to-purple-600 hover:to-purple-700 text-white font-bold py-3 md:py-4 rounded-xl shadow-xl transform active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed tracking-wide text-sm md:text-base flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>Processing Payment...</span>
                  </>
                ) : 'Complete Purchase'}
              </button>
              <button 
                type="button"
                onClick={() => navigate('/payment')}
                className="w-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-bold py-3 md:py-4 rounded-xl transition-all duration-300 border border-white/5 text-xs md:text-sm"
              >
                Back to Payment
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PlaceOrder;
