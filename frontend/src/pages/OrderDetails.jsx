import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaWhatsapp } from 'react-icons/fa';
import { getMediaUrl, handleImageError } from '../utils/mediaUtils';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const userLoginState = useSelector((state) => state.user);
  const { userInfo } = userLoginState;

  const [order, setOrder] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      fetchOrder();
    }
  }, [navigate, userInfo, id]);

  const fetchOrder = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/orders/${id}/?cache_bust=${new Date().getTime()}`, config);
      console.log('Order Details Fetched:', data);
      setOrder(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      setLoading(false);
    }
  };

  const deliverOrder = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`${import.meta.env.VITE_API_URL || ''}/api/orders/${order.id}/deliver/`, {}, config);
      await fetchOrder();
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const shipOrder = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`${import.meta.env.VITE_API_URL || ''}/api/orders/${order.id}/ship/`, {}, config);
      await fetchOrder();
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const markOutForDelivery = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`${import.meta.env.VITE_API_URL || ''}/api/orders/${order.id}/out-for-delivery/`, {}, config);
      await fetchOrder();
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const revertShipped = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`${import.meta.env.VITE_API_URL || ''}/api/orders/${order.id}/revert-ship/`, {}, config);
      await fetchOrder();
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const revertOutForDelivery = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`${import.meta.env.VITE_API_URL || ''}/api/orders/${order.id}/revert-out-for-delivery/`, {}, config);
      await fetchOrder();
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const revertDelivered = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`${import.meta.env.VITE_API_URL || ''}/api/orders/${order.id}/revert-deliver/`, {}, config);
      await fetchOrder();
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading && !order.id) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div></div>;
  if (error) return <div className="glass bg-red-500/20 p-6 text-center text-red-200">{error}</div>;

  return (
    <div className="animate-fade-in max-w-6xl mx-auto py-4 md:py-8 px-3 md:px-4 xl:px-0">
      <h1 className="text-xl md:text-4xl font-bold text-gray-200 mb-4 md:mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-teal-300 tracking-tight">
        Order #{order.id}
      </h1>

      <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
        <div className="lg:w-2/3 space-y-3 md:space-y-8">
          
          <div className="glass rounded-2xl md:rounded-3xl p-4 md:p-8">
            <h2 className="text-lg md:text-2xl font-bold mb-2 md:mb-4 pb-2 md:pb-4 border-b border-white/10 text-blue-300">Shipping</h2>
            <p className="mb-2 md:mb-4 text-xs md:text-base"><strong>Name: </strong> {order.user.name}</p>
            <p className="mb-2 md:mb-4 text-xs md:text-base"><strong>Email: </strong> <a href={`mailto:${order.user.email}`} className="text-blue-300">{order.user.email}</a></p>
            <p className="mb-2 md:mb-4 text-xs md:text-base">
              <strong>Address: </strong>
              {order.shipping_address?.address}, {order.shipping_address?.city}, {order.shipping_address?.country}
            </p>
            <p className="mb-3 md:mb-6 text-xs md:text-base">
              <strong>Phone: </strong>
              {order.shipping_address?.phone || 'Not provided'}
            </p>
            {order.is_delivered ? (
              <div className="bg-emerald-500/20 text-emerald-300 p-3 md:p-4 rounded-xl border border-emerald-500/30 text-xs md:text-base">Delivered on {order.delivered_at.substring(0, 10)}</div>
            ) : (
              <div className="bg-yellow-500/20 text-yellow-300 p-3 md:p-4 rounded-xl border border-yellow-500/30 text-xs md:text-base">Not Delivered</div>
            )}
          </div>

          {/* Order Tracking Component */}
          <div className="glass rounded-2xl md:rounded-3xl p-4 md:p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 blur-3xl rounded-full pointer-events-none"></div>
             
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 mb-6 md:mb-8">
                <div>
                   <h2 className="text-lg md:text-2xl font-bold text-blue-300">Tracking</h2>
                   <p className="text-xs md:text-lg font-bold text-white mt-1">
                      {order.is_delivered 
                        ? 'Delivered – Package arrived' 
                        : (order.is_out_for_delivery ? 'Out for Delivery'
                          : (order.is_shipped ? 'Shipped – On the way'
                            : (order.is_paid ? 'Processing your order' : 'Awaiting Payment')))}
                   </p>
                </div>
                <a 
                  href={`https://wa.me/919846974545?text=${encodeURIComponent(`Hello Brightify Support, I need help with my order #${order.id}. Name: ${order.user.name}`)}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-green-500/20 hover:bg-green-500/40 text-green-300 border border-green-500/50 py-2 md:py-3 px-4 md:px-6 rounded-xl flex items-center gap-2 md:gap-3 font-bold transition-all text-xs md:text-base shrink-0 w-full sm:w-auto justify-center"
                >
                  <FaWhatsapp className="text-base md:text-xl" /> Need Help? Chat Now
                </a>
             </div>

             {/* Progress Tracker */}
             <div className="relative mt-6 md:mt-12 mb-4 px-1 sm:px-6">
               <div className="absolute left-0 top-3 md:top-4 w-full h-1 md:h-1.5 bg-white/10 rounded-full z-0"></div>
               {(() => {
                  const currentStep = order.is_delivered ? 5 : (order.is_out_for_delivery ? 4 : (order.is_shipped ? 3 : (order.is_paid ? 2 : 1)));
                  return (
                    <>
                      <div 
                        className="absolute left-0 top-3 md:top-4 h-1 md:h-1.5 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full z-0 transition-all duration-1000 shadow-[0_0_15px_rgba(45,212,191,0.5)]" 
                        style={{ width: `${(currentStep - 1) * 25}%` }}
                      ></div>
                      
                      <div className="relative z-10 flex justify-between">
                        {[
                          { label: 'Placed', step: 1 },
                          { label: 'Processing', step: 2 },
                          { label: 'Shipped', step: 3 },
                          { label: 'Out', step: 4 },
                          { label: 'Delivered', step: 5 }
                        ].map((s, index) => {
                          const isCompleted = s.step < currentStep;
                          const isCurrent = s.step === currentStep;
                          return (
                            <div key={index} className="flex flex-col items-center gap-1.5 md:gap-3">
                              <div className={`w-7 h-7 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-[10px] md:text-sm transition-all duration-500 shadow-lg ${
                                isCompleted 
                                  ? 'bg-teal-400 text-[#0f2027]' 
                                  : isCurrent 
                                    ? 'bg-teal-400 text-[#0f2027] ring-4 md:ring-8 ring-teal-400/30 animate-pulse' 
                                  : 'bg-[#1a2e35] text-gray-300 border border-white/10'
                              }`}>
                                {isCompleted ? (
                                  <svg className="w-3.5 h-3.5 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                ) : isCurrent ? (
                                  <svg className="w-3.5 h-3.5 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                ) : s.step}
                              </div>
                              <span className={`text-[8px] md:text-xs font-bold text-center max-w-[45px] md:max-w-none leading-tight ${isCompleted ? 'text-teal-300' : isCurrent ? 'text-teal-400' : 'text-gray-400'}`}>
                                {s.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  );
               })()}
             </div>
          </div>

          <div className="glass rounded-2xl md:rounded-3xl p-4 md:p-8">
            <h2 className="text-lg md:text-2xl font-bold mb-2 md:mb-4 pb-2 md:pb-4 border-b border-white/10 text-teal-300">Payment</h2>
            <p className="mb-3 md:mb-6 text-xs md:text-base"><strong>Method: </strong> {order.payment_method}</p>
            {order.is_paid ? (
              <div className="bg-emerald-500/20 text-emerald-300 p-3 md:p-4 rounded-xl border border-emerald-500/30 text-xs md:text-base">Paid on {order.paid_at.substring(0, 10)}</div>
            ) : (
              <div className="bg-red-500/20 text-red-300 p-3 md:p-4 rounded-xl border border-red-500/30 text-xs md:text-base">Not Paid</div>
            )}
          </div>

          <div className="glass rounded-2xl md:rounded-3xl p-4 md:p-8">
            <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-6 pb-2 md:pb-4 border-b border-white/10 text-purple-300">Items</h2>
            <div className="space-y-3 md:space-y-4">
              {order.order_items.map((item, index) => (
                <div key={index} className="flex items-center gap-3 md:gap-4 pb-3 md:pb-4 border-b border-white/10 last:border-b-0">
                  <img 
                    src={getMediaUrl(item.image)} 
                    alt={item.name} 
                    onError={handleImageError}
                    className="w-10 h-10 md:w-16 md:h-16 object-cover rounded-lg md:rounded-xl shrink-0" 
                  />
                  <Link to={`/product/${item.product}`} className="hover:text-blue-300 text-xs md:text-base flex-1 min-w-0 truncate">{item.name}</Link>
                  <div className="font-bold text-xs md:text-base whitespace-nowrap shrink-0">
                    {item.qty} × ₹{item.price}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="lg:w-1/3">
          <div className="glass p-4 md:p-8 rounded-2xl md:rounded-3xl sticky top-24">
            <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-6 pb-2 md:pb-4 border-b border-white/10 text-emerald-300">Summary</h2>
            
            <div className="flex justify-between py-1.5 md:py-2 text-gray-300 text-xs md:text-base">
              <span>Items</span>
              <span className="font-bold text-white">₹{(order.total_price - order.shipping_price).toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1.5 md:py-2 text-gray-300 text-xs md:text-base">
                <span>Shipping</span>
                <span className="text-emerald-400 font-bold">FREE</span>
            </div>
            
            <div className="flex justify-between py-2 md:py-4 border-t border-white/10 font-bold text-gray-200 text-base md:text-xl text-teal-300 mt-2 md:mt-4">
              <span>Total</span>
              <span>₹{Number(order.total_price).toFixed(2)}</span>
            </div>

            {loading && <div className="text-center py-4 text-blue-300 animate-pulse">Processing...</div>}

            {/* Admin Controls */}
            {userInfo && userInfo.isAdmin && order.is_paid && (
              <div className="mt-6 md:mt-8 pt-6 border-t border-white/10">
                <h3 className="text-xs md:text-sm text-gray-400 font-bold mb-4 text-center">Admin Controls</h3>
                <div className="flex flex-col gap-3 md:gap-4">
                  {!order.is_shipped && (
                    <button 
                      onClick={shipOrder}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-3 md:py-4 rounded-xl transition-all duration-300 shadow-xl transform active:scale-[0.98] text-sm md:text-base"
                    >
                      Mark as Shipped
                    </button>
                  )}
                  {order.is_shipped && !order.is_out_for_delivery && (
                    <>
                      <button 
                        onClick={markOutForDelivery}
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-3 md:py-4 rounded-xl transition-all duration-300 shadow-xl transform active:scale-[0.98] text-sm md:text-base"
                      >
                        Mark Out for Delivery
                      </button>
                      <button 
                        onClick={revertShipped}
                        className="w-full bg-transparent border-2 border-red-500/30 hover:bg-red-500/10 text-red-400 font-bold py-2 md:py-3 rounded-xl transition-all duration-300 text-xs md:text-sm mt-1"
                      >
                        Undo "Shipped" Status
                      </button>
                    </>
                  )}
                  {order.is_out_for_delivery && !order.is_delivered && (
                    <>
                      <button 
                        onClick={deliverOrder}
                        className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-[#0f2027] font-bold text-gray-200 py-3 md:py-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(20,184,166,0.4)] hover:shadow-[0_0_30px_rgba(20,184,166,0.6)] transform active:scale-[0.98] text-sm md:text-base"
                      >
                        Mark as Delivered
                      </button>
                      <button 
                        onClick={revertOutForDelivery}
                        className="w-full bg-transparent border-2 border-red-500/30 hover:bg-red-500/10 text-red-400 font-bold py-2 md:py-3 rounded-xl transition-all duration-300 text-xs md:text-sm mt-1"
                      >
                        Undo "Out for Delivery"
                      </button>
                    </>
                  )}
                  {order.is_delivered && (
                    <button 
                      onClick={revertDelivered}
                      className="w-full bg-transparent border-2 border-red-500/30 hover:bg-red-500/10 text-red-400 font-bold py-2 md:py-3 rounded-xl transition-all duration-300 text-xs md:text-sm"
                    >
                      Undo "Delivered" Status
                    </button>
                  )}
                </div>
              </div>
            )}
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetails;
