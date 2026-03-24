import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { userLogin } from '../slices/userSlice';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../components/Loader';

const Login = () => {
  const [activeTab, setActiveTab] = useState('otp'); // 'otp' or 'password'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpMethod, setOtpMethod] = useState('email'); // 'email' or 'phone'
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const userLoginState = useSelector(state => state.user);
  const { userInfo } = userLoginState;

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect.startsWith('/') ? redirect : `/${redirect}`);
    }
  }, [navigate, userInfo, redirect]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Clear stale OTP state from previous sessions AND reset component state
  useEffect(() => {
    localStorage.removeItem('otpEmail');
    localStorage.removeItem('otpSent');
    setOtpSent(false);
    setOtp('');
  }, []);

  const passwordLoginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const config = { headers: { 'Content-type': 'application/json' } };
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL || ''}/api/users/login/`,
        { username: email, password: password },
        config
      );
      dispatch(userLogin(data));
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password');
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL || ''}/api/users/send-otp/`,
        { email }
      );
      setOtpSent(true);
      setTimer(60);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error sending OTP. Please try again.');
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL || ''}/api/users/verify-otp/`,
        { email, code: otp }
      );
      dispatch(userLogin(data));
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid OTP. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in flex items-center justify-center min-h-[70vh] py-8 md:py-12 px-3 md:px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-full max-w-md p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-teal-400 to-blue-500" />
        
        <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-teal-200 tracking-tight">
          Welcome Back
        </h1>

        {/* Auth Tabs */}
        <div className="flex p-1 md:p-1.5 bg-white/5 rounded-2xl mb-6 md:mb-8 border border-white/10">
          <button
            onClick={() => { setActiveTab('otp'); setError(''); setOtpSent(false); }}
            className={`flex-1 py-2 md:py-3 text-xs md:text-sm font-bold rounded-xl transition-all duration-300 ${activeTab === 'otp' ? 'bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            OTP Login
          </button>
          <button
            onClick={() => { setActiveTab('password'); setError(''); setOtpSent(false); }}
            className={`flex-1 py-2 md:py-3 text-xs md:text-sm font-bold rounded-xl transition-all duration-300 ${activeTab === 'password' ? 'bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Password
          </button>
        </div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/30 text-red-200 p-4 rounded-xl mb-6 text-sm text-center backdrop-blur-md"
          >
            {error}
          </motion.div>
        )}
        
        <AnimatePresence mode="wait">
          {activeTab === 'password' ? (
            <motion.form 
              key="password-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={passwordLoginHandler} 
              className="space-y-5"
            >
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input w-full p-3 md:p-4 pl-4 md:pl-5 text-white"
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-input w-full p-3 md:p-4 pl-4 md:pl-5 pr-12 text-white"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-bold py-3 md:py-4 rounded-2xl transition-all duration-300 shadow-xl transform active:scale-[0.98] mt-4 flex items-center justify-center space-x-2 text-sm md:text-base min-h-[50px] md:min-h-[60px]"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <span>Sign In</span>}
              </button>
            </motion.form>
          ) : (
            <motion.div 
              key="otp-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="glass-input w-full p-3 md:p-4 pl-4 md:pl-5 text-white"
                      placeholder="your@email.com"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white font-black py-3 md:py-4 rounded-2xl shadow-xl transition-all text-sm md:text-base"
                  >
                    {loading ? 'SENDING...' : 'GET OTP'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-5 text-center">
                  <div className="space-y-2 text-left">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Verification Code</label>
                    <input 
                      type="text" 
                      required 
                      maxLength="6"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="glass-input w-full p-3 md:p-5 text-center text-2xl md:text-3xl font-black tracking-[0.5em] md:tracking-[0.8em] text-white"
                      placeholder="••••••"
                    />
                  </div>
                  
                  <p className="text-xs text-gray-400">
                    {timer > 0 ? `Resend in ${timer}s` : (
                      <button type="button" onClick={handleSendOtp} className="text-blue-400 font-bold hover:text-blue-300">Resend Code</button>
                    )}
                  </p>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white font-black py-3 md:py-4 rounded-2xl shadow-xl text-sm md:text-base min-h-[50px] md:min-h-[60px] flex items-center justify-center"
                  >
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'VERIFY & SIGN IN'}
                  </button>
                  
                  <button type="button" onClick={() => setOtpSent(false)} className="text-xs text-gray-500 hover:text-white transition-colors">
                    Change Email
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between border-t border-white/5 pt-8 space-y-4 sm:space-y-0">
          <div className="text-gray-400 text-sm">
            Don't have an account?
          </div>
          <Link to={`/register?redirect=${redirect}`} className="text-blue-400 hover:text-teal-300 transition-all font-black text-sm uppercase tracking-tighter">
            Register Account
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
