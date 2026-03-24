import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { userLogin } from '../slices/userSlice';
import Loader from '../components/Loader';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLoginState = useSelector(state => state.user);
  const { userInfo } = userLoginState;

  const location = useLocation();
  const [activeTab, setActiveTab] = useState('settings');

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setPhone(userInfo.phone_number || '');
      fetchMyOrders();
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tab') === 'orders') {
      setActiveTab('orders');
    } else if (params.get('tab') === 'settings') {
      setActiveTab('settings');
    }
  }, [location.search]);

  const fetchMyOrders = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/orders/myorders/?cache_bust=${new Date().getTime()}`, config);
      setOrders(data);
      setLoadingOrders(false);
    } catch (error) {
      console.error(error);
      setLoadingOrders(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else if (phone && phone.length !== 10) {
      setMessage('Phone number must be exactly 10 digits');
    } else {
      try {
        const config = {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.put(
          `${import.meta.env.VITE_API_URL || ''}/api/users/profile/update/`,
          { name, email: email, password: password, phone_number: phone },
          config
        );
        dispatch(userLogin(data));
        setMessage('Profile Updated Successfully');
      } catch (error) {
        setMessage(error.response?.data?.detail || error.message);
      }
    }
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto py-4 md:py-8 px-3 md:px-4">
      
      {/* Mobile Tabs */}
      <div className="flex lg:hidden bg-white/5 p-1 rounded-2xl mb-6 border border-white/10 shadow-inner">
        <button 
          onClick={() => setActiveTab('settings')} 
          className={`flex-1 py-3 rounded-xl text-xs font-black tracking-widest transition-all duration-300 ${activeTab === 'settings' ? 'bg-white/20 text-white shadow-xl scale-[1.02]' : 'text-gray-500 hover:text-white'}`}
        >
          SETTINGS
        </button>
        <button 
          onClick={() => setActiveTab('orders')} 
          className={`flex-1 py-3 rounded-xl text-xs font-black tracking-widest transition-all duration-300 ${activeTab === 'orders' ? 'bg-white/20 text-white shadow-xl scale-[1.02]' : 'text-gray-500 hover:text-white'}`}
        >
          MY ORDERS
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
        
        {/* Profile Settings */}
        <div className={`${activeTab === 'settings' ? 'block' : 'hidden'} lg:block lg:w-1/3`}>
          <div className="glass p-4 md:p-8 rounded-2xl md:rounded-3xl sticky top-24">
            <h2 className="text-lg md:text-2xl font-bold mb-4 md:mb-6 pb-3 md:pb-4 border-b border-white/10 text-blue-300">User Profile</h2>
            
            {message && <div className="bg-white/10 p-3 rounded-xl mb-4 text-center text-xs md:text-sm">{message}</div>}

            <form onSubmit={submitHandler} className="space-y-3 md:space-y-5">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="glass-input w-full p-3 md:p-4 text-white text-sm" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="glass-input w-full p-3 md:p-4 text-white text-sm" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Phone Number</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 10) setPhone(val);
                  }} 
                  className="glass-input w-full p-3 md:p-4 text-white text-sm" 
                  placeholder="10-digit mobile number"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="glass-input w-full p-3 md:p-4 text-white text-sm" placeholder="Leave blank to keep same" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="glass-input w-full p-3 md:p-4 text-white text-sm" />
              </div>

              <button type="submit" className="w-full bg-white text-black hover:bg-gray-100 font-black tracking-widest py-3 md:py-4 rounded-xl md:rounded-2xl transition-all duration-300 mt-4 text-xs md:text-sm shadow-xl hover:-translate-y-1">
                SAVE CHANGES
              </button>
            </form>
          </div>
        </div>

        {/* Order History */}
        <div className={`${activeTab === 'orders' ? 'block' : 'hidden'} lg:block lg:w-2/3`}>
          <div className="glass p-4 md:p-8 rounded-2xl md:rounded-3xl min-h-[300px] md:min-h-[500px]">
            <h2 className="text-lg md:text-2xl font-bold mb-4 md:mb-6 pb-3 md:pb-4 border-b border-white/10 text-teal-300">My Orders</h2>
            
            {loadingOrders ? (
              <Loader message="Loading Orders..." />
            ) : orders.length === 0 ? (
              <div className="text-gray-300 text-center mt-10">You have no previous orders.</div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="glass p-3 md:p-6 rounded-xl md:rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 md:gap-4">
                    <div>
                      <div className="text-[10px] md:text-sm text-gray-400 mb-0.5">Order #{order.id}</div>
                      <div className="font-bold text-sm md:text-lg mb-1">₹{order.total_price}</div>
                      <div className="text-sm">
                        <span className="text-gray-400">Date: </span>
                        {order.created_at.substring(0, 10)}
                      </div>
                    </div>
                    
                    <div className="flex flex-row sm:flex-col gap-1.5 md:gap-2 min-w-[100px] md:min-w-[120px]">
                      {order.is_paid ? (
                        <div className="bg-emerald-500/20 text-emerald-300 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[9px] md:text-xs text-center border border-emerald-500/30">Paid</div>
                      ) : (
                        <div className="bg-red-500/20 text-red-300 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[9px] md:text-xs text-center border border-red-500/30">Not Paid</div>
                      )}
                      
                      {order.is_delivered ? (
                        <div className="bg-blue-500/20 text-blue-300 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[9px] md:text-xs text-center border border-blue-500/30">Delivered</div>
                      ) : (
                        <div className="bg-yellow-500/20 text-yellow-300 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[9px] md:text-xs text-center border border-yellow-500/30">Processing</div>
                      )}
                    </div>

                    <Link to={`/orders/${order.id}`} className="glass-button text-[10px] md:text-sm py-1.5 md:py-2 px-3 md:px-4 text-center mt-1 sm:mt-0">
                      Details
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
