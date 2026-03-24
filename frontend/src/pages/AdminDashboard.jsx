import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { FaUsers, FaShoppingBag, FaRupeeSign, FaBox, FaClock, FaCheckCircle, FaTrash, FaEdit, FaPlus, FaTags } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../components/Loader';
import { getMediaUrl, handleImageError } from '../utils/mediaUtils';

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const StatCard = ({ icon: Icon, label, value, color, gradient }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25 }}
    className="glass rounded-xl sm:rounded-2xl p-3 sm:p-5 flex items-center gap-3 sm:gap-4 border border-white/5 hover:border-white/20 transition-all duration-300 group"
  >
    <div className={`p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl ${gradient} shadow-lg group-hover:scale-110 transition-transform duration-300 shrink-0`}>
      <Icon className={`text-base sm:text-xl ${color}`} />
    </div>
    <div className="min-w-0">
      <p className="text-gray-400 text-[9px] sm:text-xs font-semibold tracking-wide capitalize truncate">{label}</p>
      <p className="text-lg sm:text-2xl font-bold text-white">{value}</p>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userLoginState = useSelector((state) => state.user);
  const { userInfo } = userLoginState;

  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(new URLSearchParams(location.search).get('tab') || 'overview');
  
  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Responsive handler with debouncing for smoother resizing
  useEffect(() => {
    let timeoutId = null;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 1024);
      }, 150);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Selection states
  const [selectedItems, setSelectedItems] = useState([]);

  // Dashboard stats (counts)
  const [stats, setStats] = useState({
    productCount: 0,
    orderCount: 0,
    userCount: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    paidOrders: 0
  });

  // Modal states
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);

  // Prefetch ALL data on mount so tab switching is instant
  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
    } else {
      // Fire all fetches in parallel
      Promise.all([
        fetchStats(),
        fetchOrders(),
        fetchUsers(),
        fetchProducts(),
        fetchCategories(),
        fetchBanners()
      ]).catch(err => console.error('Dashboard prefetch error:', err));
    }
  }, [navigate, userInfo]);

  // Reset UI state on tab change (data is already loaded)
  useEffect(() => {
    setSearchTerm('');
    setSelectedItems([]);
  }, [activeTab]);

  const config = userInfo ? { headers: { Authorization: `Bearer ${userInfo.token}` } } : {};

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/products/admin/stats/`, config);
      setStats(data);
      setLoading(false);
    } catch (err) {
      console.error('Stats fetch error:', err);
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/products/?page=all&admin=true`);
      setProducts(data.products || []);
    } catch (err) { console.error('Products fetch error:', err); }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/orders/`, config);
      setOrders(data || []);
    } catch (err) { console.error('Orders fetch error:', err); }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/users/`, config);
      setUsers(data || []);
    } catch (err) { console.error('Users fetch error:', err); }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/products/categories/`);
      setCategories(data || []);
    } catch (err) { console.error('Categories fetch error:', err); }
  };

  const fetchBanners = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/products/banners/admin/`, config);
      setBanners(data || []);
    } catch (err) { console.error('Banners fetch error:', err); }
  };

  const fetchData = () => {
    fetchStats();
    // Refresh the active tab's data after a CRUD operation
    if (activeTab === 'products') { fetchProducts(); fetchCategories(); }
    else if (activeTab === 'orders') fetchOrders();
    else if (activeTab === 'users') fetchUsers();
    else if (activeTab === 'categories') fetchCategories();
    else if (activeTab === 'banners') fetchBanners();
  };

  // Helper toggle selection
  const toggleSelection = (id) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = (items) => {
    if (selectedItems.length === items.length) setSelectedItems([]);
    else setSelectedItems(items.map(i => i.id));
  };

  // Memoized Filter Logic for Performance
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.slug.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || String(p.category_id) === String(categoryFilter);
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = String(o.id).includes(searchTerm) || o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      let matchesStatus = true;
      if (statusFilter === 'pending') matchesStatus = !o.is_paid;
      else if (statusFilter === 'paid') matchesStatus = o.is_paid && !o.is_delivered;
      else if (statusFilter === 'delivered') matchesStatus = o.is_delivered;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const filteredCategories = useMemo(() => {
    return categories.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const filteredBanners = useMemo(() => {
    return banners.filter(b => 
      b.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [banners, searchTerm]);

  // Weekly sales data (group orders by day of week)
  const weeklyData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    // Initialize data for the last 7 days
    const result = days.map(d => ({ day: d, sales: 0, orders: 0 }));
    
    // Sort orders by date to ensure we process them correctly if needed, 
    // but here we just map to day of week
    if (orders && orders.length > 0) {
      orders.forEach(o => {
        if (!o.created_at) return;
        const d = new Date(o.created_at);
        const idx = d.getDay();
        if (!isNaN(idx) && result[idx]) {
          result[idx].sales += Number(o.total_price || 0);
          result[idx].orders += 1;
        }
      });
    }
    return result;
  }, [orders]);

  // Category distribution
  const categoryData = useMemo(() => {
    const cats = {};
    products.forEach(p => {
      const name = p.category_name || 'Uncategorized';
      cats[name] = (cats[name] || 0) + 1;
    });
    return Object.entries(cats).map(([name, value]) => ({ name, value }));
  }, [products]);

  // Top selling products by revenue (hardcoded for now since we lack order-item grouping)
  const topProducts = (products || []).slice(0, 5).map(p => ({ 
    name: (p.name || 'Unknown').substring(0, 20) + ((p.name || '').length > 20 ? '…' : ''), 
    price: Number(p.price || 0) 
  }));

  // Recent activity feed (latest 8 combined)
  const recentActivity = [
    ...(orders || []).slice(0, 4).map(o => ({
      type: 'order',
      text: `Order #${String(o.id || '').substring(0, 8)} placed by ${o.user?.name || 'Unknown'}`,
      time: o.created_at,
      color: 'bg-blue-500',
    })),
    ...(users || []).slice(0, 4).map(u => ({
      type: 'user',
      text: `${u.name || 'User'} registered`,
      time: u.date_joined || '',
      color: 'bg-green-500',
    })),
  ].sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0)).slice(0, 8);

  // Handlers
  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`${import.meta.env.VITE_API_URL || ''}/api/products/delete/${id}/`, config);
        fetchData();
      } catch (err) { alert(err.response?.data?.detail || err.message); }
    }
  };

  const handleToggleAdmin = async (user) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`${import.meta.env.VITE_API_URL || ''}/api/users/update/${user.id}/`, { ...user, isAdmin: !user.isAdmin }, config);
      fetchData();
    } catch (err) { alert(err.response?.data?.detail || err.message); }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`${import.meta.env.VITE_API_URL || ''}/api/users/delete/${id}/`, config);
        fetchData();
      } catch (err) { alert(err.response?.data?.detail || err.message); }
    }
  };

  const handleDeliverOrder = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`${import.meta.env.VITE_API_URL || ''}/api/orders/${id}/deliver/`, {}, config);
      fetchData();
    } catch (err) { alert(err.response?.data?.detail || err.message); }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}`, 'Content-Type': 'multipart/form-data' } };
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key] instanceof File) {
          data.append(key, formData[key]);
        } else if (key !== 'image') {
          data.append(key, formData[key]);
        }
      });

      if (editingItem) {
        await axios.put(`${import.meta.env.VITE_API_URL || ''}/api/products/update/${editingItem.id}/`, data, config);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/products/create/`, data, config);
      }
      setShowProductModal(false);
      setEditingItem(null);
      setFormData({});
      fetchStats(); // Fetch updated counts and data
      if (activeTab === 'products') fetchProducts();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || JSON.stringify(err.response?.data) || err.message;
      console.error('Upload error details:', err.response?.data);
      alert(`Upload Failed: ${errorMsg}`);
    } finally { setUploading(false); }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}`, 'Content-Type': 'multipart/form-data' } };
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key] instanceof File) {
          data.append(key, formData[key]);
        } else if (key !== 'image') {
          data.append(key, formData[key] || '');
        }
      });
      
      if (editingItem) {
        await axios.put(`${import.meta.env.VITE_API_URL || ''}/api/products/categories/update/${editingItem.id}/`, data, config);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/products/categories/create/`, data, config);
      }
      setShowCategoryModal(false);
      setEditingItem(null);
      setFormData({});
      fetchStats();
      if (activeTab === 'categories') fetchCategories();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || JSON.stringify(err.response?.data) || err.message;
      console.error('Category upload error:', err.response?.data);
      alert(`Category Upload Failed: ${errorMsg}`);
    }
    finally { setUploading(false); }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure? This will NOT delete products in this category, but they will become uncategorized.')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`${import.meta.env.VITE_API_URL || ''}/api/products/categories/delete/${id}/`, config);
        fetchData();
      } catch (err) { alert(err.response?.data?.detail || err.message); }
    }
  };

  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}`, 'Content-Type': 'multipart/form-data' } };
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key] instanceof File) {
          data.append(key, formData[key]);
        } else if (key !== 'image') {
          data.append(key, formData[key] || '');
        }
      });
      
      if (editingItem) {
        await axios.put(`${import.meta.env.VITE_API_URL || ''}/api/products/banners/update/${editingItem.id}/`, data, config);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/products/banners/create/`, data, config);
      }
      setShowBannerModal(false);
      setEditingItem(null);
      setFormData({});
      fetchStats();
      if (activeTab === 'banners') fetchBanners();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || JSON.stringify(err.response?.data) || err.message;
      console.error('Banner upload error:', err.response?.data);
      alert(`Banner Upload Failed: ${errorMsg}`);
    }
    finally { setUploading(false); }
  };

  const handleDeleteBanner = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`${import.meta.env.VITE_API_URL || ''}/api/products/banners/delete/${id}/`, config);
        fetchData();
      } catch (err) { alert(err.response?.data?.detail || err.message); }
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedItems.length} selected items?`)) return;
    
    setLoading(true);
    try {
      for (const id of selectedItems) {
        if (activeTab === 'products') await axios.delete(`${import.meta.env.VITE_API_URL || ''}/api/products/delete/${id}/`, config);
        else if (activeTab === 'users') await axios.delete(`${import.meta.env.VITE_API_URL || ''}/api/users/delete/${id}/`, config);
      }
      setSelectedItems([]);
      fetchData();
    } catch (err) {
      console.error('Bulk delete error:', err);
      alert('Error during bulk deletion');
    }
    setLoading(false);
  };

  if (loading && orders.length === 0) {
    return <div className="min-h-screen flex items-center justify-center bg-[#0c161a]"><Loader message="Synchronizing Dashboard..." color="purple" /></div>;
  }

  const TABS = [
    { key: 'overview', label: 'Overview' },
    { key: 'orders', label: 'Orders' },
    { key: 'users', label: 'Users' },
    { key: 'products', label: 'Products' },
    { key: 'categories', label: 'Categories' },
    { key: 'banners', label: 'Banners' },
  ];

  return (
    <div
      className="min-h-screen py-4 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto animate-fade-in"
    >
      {/* Header Section */}
      <div className="glass-dark p-3 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[2rem] lg:rounded-[3rem] mb-4 sm:mb-8 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/10 blur-[100px] -ml-32 -mb-32 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <button 
              onClick={() => navigate('/')} 
              className="hidden sm:flex p-2.5 sm:p-3 bg-white/5 hover:bg-white/10 rounded-xl sm:rounded-2xl border border-white/10 text-gray-400 hover:text-white transition-all group shrink-0"
              title="Back to Store"
            >
              <FaShoppingBag className="text-base sm:text-lg group-hover:scale-110 transition-transform" />
            </button>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white tracking-tight">Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">Dashboard</span></h1>
              <p className="text-gray-400 mt-0.5 text-[10px] sm:text-xs capitalize">Welcome back, {userInfo?.name?.split(' ')[0]}!</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <div className="hidden lg:block text-xs font-bold text-gray-400 glass px-4 py-2.5 rounded-xl border border-white/5 capitalize tracking-wider">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>
            <button 
              onClick={() => {
                if (window.confirm('Logout from Admin?')) {
                  localStorage.removeItem('userInfo');
                  window.location.href = '/login';
                }
              }}
              className="px-3 sm:px-5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] sm:text-xs font-bold capitalize tracking-wide rounded-lg sm:rounded-xl border border-red-500/20 transition-all active:scale-95"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Integrated Tabs */}
        <div className="relative z-10 grid grid-cols-3 sm:flex sm:flex-wrap gap-1 sm:gap-2 bg-black/20 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl mt-4 sm:mt-6 border border-white/5">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-2.5 sm:py-3 px-2 sm:px-6 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold capitalize tracking-wide sm:tracking-widest transition-all min-h-[40px] touch-manipulation ${activeTab === tab.key ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-5 sm:space-y-8">
          {/* Stats Cards */}
          <div className="flex justify-between items-center mb-2 sm:mb-4">
            <h3 className="text-base sm:text-xl font-bold text-white px-1 sm:px-2">Business Overview</h3>
            <button 
              onClick={fetchStats} 
              className="text-[9px] sm:text-xs font-bold text-gray-200 capitalize tracking-wider sm:tracking-widest text-blue-400 hover:text-blue-300 flex items-center gap-1.5 sm:gap-2 bg-blue-500/5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-blue-500/10 transition-all active:scale-95"
            >
              <svg className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              Refresh
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-5">
            <StatCard icon={FaUsers} label="Total Users" value={stats.userCount} color="text-blue-300" gradient="bg-blue-500/20" />
            <StatCard icon={FaShoppingBag} label="Total Orders" value={stats.orderCount} color="text-green-300" gradient="bg-green-500/20" />
            <StatCard icon={FaRupeeSign} label="Revenue" value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`} color="text-yellow-300" gradient="bg-yellow-500/20" />
            <StatCard icon={FaBox} label="Products" value={stats.productCount} color="text-purple-300" gradient="bg-purple-500/20" />
            <StatCard icon={FaClock} label="Pending" value={stats.pendingOrders} color="text-orange-300" gradient="bg-orange-500/20" />
            <StatCard icon={FaCheckCircle} label="Paid Orders" value={stats.paidOrders} color="text-teal-300" gradient="bg-teal-500/20" />
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
            {/* Weekly Sales */}
            <div className="glass rounded-xl sm:rounded-2xl p-3 sm:p-6">
              <h3 className="text-sm sm:text-lg font-bold mb-3 sm:mb-4 text-blue-300">Weekly Sales (₹)</h3>
              <ResponsiveContainer width="100%" height={isMobile ? 160 : 220}>
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: isMobile ? 9 : 12 }} />
                  <YAxis tick={{ fill: '#9ca3af', fontSize: isMobile ? 9 : 12 }} width={isMobile ? 30 : 60} />
                  <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 12 }} />
                  <Area isAnimationActive={!isMobile} type="monotone" dataKey="sales" stroke="#3b82f6" fill="url(#salesGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Orders Trend */}
            <div className="glass rounded-xl sm:rounded-2xl p-3 sm:p-6">
              <h3 className="text-sm sm:text-lg font-bold mb-3 sm:mb-4 text-green-300">Orders Trend</h3>
              <ResponsiveContainer width="100%" height={isMobile ? 160 : 220}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: isMobile ? 9 : 12 }} />
                  <YAxis tick={{ fill: '#9ca3af', fontSize: isMobile ? 9 : 12 }} width={isMobile ? 30 : 60} />
                  <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 12 }} />
                  <Bar isAnimationActive={!isMobile} dataKey="orders" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
            {/* Category Distribution */}
            <div className="glass rounded-xl sm:rounded-2xl p-3 sm:p-6">
              <h3 className="text-sm sm:text-lg font-bold mb-3 sm:mb-4 text-purple-300">Category Distribution</h3>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={isMobile ? 180 : 220}>
                  <PieChart>
                    <Pie isAnimationActive={!isMobile} data={categoryData} cx="50%" cy="50%" outerRadius={isMobile ? 55 : 80} dataKey="value" label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}>
                      {categoryData.map((_, i) => (
                        <Cell key={`cell-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-gray-400 py-12 sm:py-16">No category data</div>
              )}
            </div>

            {/* Top Products */}
            <div className="glass rounded-xl sm:rounded-2xl p-3 sm:p-6">
              <h3 className="text-sm sm:text-lg font-bold mb-3 sm:mb-4 text-yellow-300">Top Products by Price</h3>
              <ResponsiveContainer width="100%" height={isMobile ? 180 : 220}>
                <BarChart data={topProducts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: isMobile ? 9 : 11 }} />
                  <YAxis dataKey="name" type="category" tick={{ fill: '#9ca3af', fontSize: isMobile ? 8 : 10 }} width={isMobile ? 70 : 100} />
                  <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 12 }} />
                  <Bar isAnimationActive={!isMobile} dataKey="price" fill="#f59e0b" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass rounded-xl sm:rounded-2xl p-3 sm:p-6">
            <h3 className="text-sm sm:text-lg font-bold mb-3 sm:mb-5 text-gray-200">Recent Activity</h3>
            {recentActivity.length === 0 ? (
              <div className="text-center text-gray-400 py-6 sm:py-8 text-xs sm:text-sm">No recent activity</div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {recentActivity.map((act, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 sm:gap-4 py-2 sm:py-3 px-3 sm:px-4 bg-white/5 rounded-lg sm:rounded-xl hover:bg-white/10 transition-colors">
                    <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${act.color} shrink-0`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] sm:text-sm text-white truncate">{act.text}</p>
                    </div>
                    <div className="text-[9px] sm:text-xs text-gray-500 shrink-0">
                      {act.time ? new Date(act.time).toLocaleDateString('en-IN') : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-white/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h2 className="text-xl font-bold text-blue-300">All Orders ({filteredOrders.length})</h2>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <input 
                  type="text" 
                  placeholder="Search Order ID or Customer..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-10 text-xs text-white focus:border-blue-500/50 outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaShoppingBag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
              </div>
              <select 
                className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-xs text-gray-300 outline-none cursor-pointer hover:bg-white/10 transition-all font-bold"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all" className="bg-[#111]">All Status</option>
                <option value="pending" className="bg-[#111]">Pending</option>
                <option value="paid" className="bg-[#111]">Paid / Un-delivered</option>
                <option value="delivered" className="bg-[#111]">Delivered</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm whitespace-nowrap">
              <thead>
                <tr className="text-left text-gray-400 border-b border-white/10">
                  <th className="pb-3 pr-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-white/10 bg-white/5" 
                      checked={selectedItems.length === filteredOrders.length && filteredOrders.length > 0}
                      onChange={() => toggleSelectAll(filteredOrders)}
                    />
                  </th>
                  <th className="pb-3 pr-4">Order #</th>
                  <th className="pb-3 pr-4">Customer</th>
                  <th className="pb-3 pr-4">Total</th>
                  <th className="pb-3 pr-4">Paid</th>
                  <th className="pb-3 pr-4">Delivered</th>
                  <th className="pb-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.map(order => (
                  <tr key={order.id} className={`hover:bg-white/5 transition-colors ${selectedItems.includes(order.id) ? 'bg-blue-500/5' : ''}`}>
                    <td className="py-3 pr-4">
                      <input 
                        type="checkbox" 
                        className="rounded border-white/10 bg-white/5" 
                        checked={selectedItems.includes(order.id)}
                        onChange={() => toggleSelection(order.id)}
                      />
                    </td>
                    <td className="py-3 pr-4 font-bold">#{order.id}</td>
                    <td className="py-3 pr-4 text-gray-300">{order.user?.name}</td>
                    <td className="py-3 pr-4 font-bold">₹{Number(order.total_price).toLocaleString('en-IN')}</td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${order.is_paid ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                        {order.is_paid ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${order.is_delivered ? 'bg-blue-500/20 text-blue-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                        {order.is_delivered ? 'Delivered' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center space-x-2">
                        <Link 
                          to={`/orders/${order.id}`} 
                          className="px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 rounded-lg text-xs font-bold transition-all"
                        >
                          View
                        </Link>
                        {!order.is_delivered && order.is_paid && (
                          <button 
                            onClick={() => handleDeliverOrder(order.id)} 
                            className="px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg text-xs font-bold text-gray-200 capitalize tracking-wider transition-all shadow-lg shadow-green-500/10"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredOrders.length === 0 && <div className="text-center text-gray-400 py-12 font-bold capitalize tracking-wide text-xs">No orders matching criteria</div>}
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div className="bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-white/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h2 className="text-xl font-bold text-green-300">All Users ({filteredUsers.length})</h2>
            <div className="relative flex-1 max-w-md">
              <input 
                type="text" 
                placeholder="Search Name or Email..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-10 text-xs text-white focus:border-green-500/50 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaUsers className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
            </div>
          </div>

          <div className="space-y-3">
            {filteredUsers.map(user => (
              <div key={user.id} className={`glass bg-white/5 hover:bg-white/10 px-4 py-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between transition-all gap-4 border border-white/5 ${selectedItems.includes(user.id) ? 'border-green-500/30 bg-green-500/5' : ''}`}>
                <div className="flex items-center gap-4">
                  <input 
                    type="checkbox" 
                    className="rounded border-white/10 bg-white/5" 
                    checked={selectedItems.includes(user.id)}
                    onChange={() => toggleSelection(user.id)}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-bold text-white text-lg truncate">{user.name}</div>
                      {user.isAdmin && <span className="bg-orange-500/20 text-orange-400 text-[10px] px-2 py-0.5 rounded-full border border-orange-500/30 capitalize font-bold text-gray-200">Admin</span>}
                    </div>
                    <div className="text-sm text-gray-400 truncate mb-2">{user.email}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded-lg border border-white/5 capitalize tracking-wider font-bold">
                        Joined: {user.date_joined ? new Date(user.date_joined).toLocaleDateString('en-IN') : 'New User'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/10">
                  <button
                    onClick={() => handleToggleAdmin(user)}
                    aria-label="Toggle admin status"
                    className={`flex-1 sm:flex-initial text-center px-4 py-2.5 rounded-xl text-xs font-bold text-gray-200 capitalize tracking-wide transition-all active:scale-95 border ${user.isAdmin ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' : 'bg-blue-500/20 text-blue-300 border-blue-500/30'}`}
                  >
                    {user.isAdmin ? 'Demote' : 'Make Admin'}
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(user.id)} 
                    className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 transition-all active:scale-95 group" 
                    aria-label="Delete user"
                  >
                    <FaTrash size={14} className="group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {users.length === 0 && <div className="text-center text-gray-400 py-12">No users found</div>}
        </div>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-white/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h2 className="text-xl font-bold text-purple-300">All Products ({filteredProducts.length})</h2>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <input 
                  type="text" 
                  placeholder="Search Product Name or Slug..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-10 text-xs text-white focus:border-purple-500/50 outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaBox className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
              </div>
              <select 
                className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-xs text-gray-300 outline-none cursor-pointer hover:bg-white/10 transition-all font-bold"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all" className="bg-[#111]">All Categories</option>
                {categories.map(c => <option key={c.id} value={c.id} className="bg-[#111]">{c.name}</option>)}
              </select>
              <button 
                onClick={() => { setEditingItem(null); setFormData({}); setShowProductModal(true); }} 
                className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-xl text-xs font-bold text-gray-200 capitalize tracking-wide flex items-center gap-2 transition-all border border-purple-500/10 shadow-lg shadow-purple-500/5 active:scale-95"
              >
                <FaPlus size={12} /> Add Product
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                className={`bg-white/5 rounded-xl sm:rounded-3xl overflow-hidden border border-white/5 hover:border-purple-500/30 transition-all duration-300 group relative flex flex-row sm:flex-col ${selectedItems.includes(product.id) ? 'border-purple-500/40 bg-purple-500/5' : ''}`}
              >
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
                  <input 
                    type="checkbox" 
                    className="rounded border-white/20 bg-black/40 w-4 h-4 sm:w-5 sm:h-5 cursor-pointer accent-purple-500" 
                    checked={selectedItems.includes(product.id)}
                    onChange={() => toggleSelection(product.id)}
                  />
                </div>
                <div className="w-28 sm:w-full aspect-square bg-black/20 relative overflow-hidden shrink-0">
                  {product.image ? (
                    <img 
                      src={getMediaUrl(product.image)} 
                      alt={product.name} 
                      onError={handleImageError}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-purple-500/5">
                      <FaBox className="text-purple-500/20 text-3xl sm:text-5xl" />
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 hidden sm:block">
                    <div className="bg-black/70 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl border border-white/10 inline-block">
                      <span className="text-white font-bold text-xs sm:text-sm">₹{Number(product.price).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
                <div className="p-3 flex-1 flex flex-col min-w-0 sm:p-5">
                  <div className="flex justify-between items-start mb-1 sm:mb-2">
                    <h4 className="font-bold text-white text-sm sm:text-base line-clamp-1 capitalize">{product.name}</h4>
                  </div>
                  <div className="sm:hidden mb-2 text-purple-300 font-bold text-sm">₹{Number(product.price).toLocaleString('en-IN')}</div>
                  <p className="text-[10px] text-gray-500 mb-2 sm:mb-4 bg-white/5 w-max px-2 py-0.5 rounded-md border border-white/5 capitalize">{product.category_name || 'No Category'}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-[10px] font-bold text-gray-400 capitalize">{product.stock} in stock</span>
                    </div>
                    <div className="flex items-center gap-1 relative z-20">
                      <button onClick={(e) => { e.stopPropagation(); setEditingItem(product); setFormData(product); setShowProductModal(true); }} className="p-1.5 sm:p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"><FaEdit size={14} /></button>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteProduct(product.id); }} className="p-1.5 sm:p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><FaTrash size={14} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredProducts.length === 0 && <div className="text-center text-gray-400 py-20 font-bold tracking-wide text-sm opacity-20">No matching products</div>}
        </div>
      )}

      {/* CATEGORIES TAB */}
      {activeTab === 'categories' && (
        <div className="glass rounded-2xl p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-teal-300">All Categories ({categories.length})</h2>
            <button
              onClick={() => { setEditingItem(null); setFormData({}); setShowCategoryModal(true); }}
              className="glass-button bg-teal-500/20 text-teal-200 px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 border-teal-500/30"
            >
              <FaPlus size={12} /> <span>Add Category</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {filteredCategories.map(cat => (
              <div 
                key={cat.id} 
                className="bg-white/5 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/5 flex items-center justify-between group hover:border-teal-500/40 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-teal-500/5"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-teal-500/10 overflow-hidden flex items-center justify-center border border-white/10 group-hover:border-teal-500/30 transition-colors shrink-0">
                    {cat.image ? (
                      <img 
                        src={getMediaUrl(cat.image)} 
                        alt={cat.name} 
                        onError={handleImageError}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        loading="lazy"
                      />
                    ) : (
                      <FaTags className="text-teal-400 text-base sm:text-xl" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-white capitalize tracking-wider text-xs sm:text-sm truncate">{cat.name}</h4>
                    <p className="text-[9px] sm:text-[10px] text-gray-500 font-mono mt-1 bg-white/5 px-2 py-0.5 rounded-lg w-max border border-white/5">{cat.slug}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button onClick={() => { setEditingItem(cat); setFormData(cat); setShowCategoryModal(true); }} className="text-blue-400 hover:text-blue-200 p-2 bg-blue-500/10 rounded-lg transition-colors"><FaEdit size={12} /></button>
                  <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-400 hover:text-red-200 p-2 bg-red-500/10 rounded-lg transition-colors"><FaTrash size={12} /></button>
                </div>
              </div>
            ))}
          </div>
          {filteredCategories.length === 0 && <div className="text-center text-gray-400 py-12">No categories found</div>}
        </div>
      )}
      {/* BULK ACTION BAR */}
      <AnimatePresence>
        {selectedItems.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-6 bg-[#111] border border-white/10 px-6 py-4 rounded-3xl shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-gray-200">
                {selectedItems.length}
              </div>
              <div className="text-sm font-bold text-gray-300">Items selected</div>
            </div>
            <div className="h-8 w-px bg-white/10"></div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleBulkDelete}
                className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold text-gray-200 capitalize tracking-wide rounded-xl border border-red-500/20 transition-all flex items-center gap-2"
              >
                <FaTrash size={12} /> Delete Selected
              </button>
              <button 
                onClick={() => setSelectedItems([])}
                className="px-5 py-2.5 text-gray-500 hover:text-white text-xs font-bold text-gray-200 capitalize tracking-wide transition-all"
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProductModal && (
          <div className="fixed inset-0 z-[100] flex justify-center items-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ y: 50, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: 50, opacity: 0 }}
              className="glass-dark w-full max-w-2xl rounded-t-3xl sm:rounded-3xl p-6 md:p-10 max-h-screen sm:max-h-[90vh] overflow-y-auto relative border border-white/10"
            >
              <button onClick={() => setShowProductModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <div className="w-2 h-8 bg-purple-500 rounded-full"></div>
                {editingItem ? 'Edit Product' : 'Add New Product'}
              </h3>
              
              <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 capitalize mb-2 tracking-wide px-1">Product Name</label>
                  <input required placeholder="e.g. Premium Cotton Shirt" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-purple-500/50 transition-all outline-none" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 capitalize mb-2 tracking-wide px-1">Slug</label>
                  <input required placeholder="premium-cotton-shirt" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-purple-500/50 transition-all outline-none" value={formData.slug || ''} onChange={e => setFormData({ ...formData, slug: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 capitalize mb-2 tracking-wide px-1">Category</label>
                  <div className="relative">
                    <select 
                      required 
                      className="w-full bg-[#111] border border-white/10 rounded-2xl p-4 text-white appearance-none focus:border-purple-500/50 transition-all outline-none cursor-pointer" 
                      value={formData.category || ''} 
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="" className="bg-[#111]">Select Category</option>
                      {categories.map(c => <option key={c.id} value={c.id} className="bg-[#111]">{c.name}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 capitalize mb-2 tracking-wide px-1">Price (₹)</label>
                  <input required type="number" placeholder="999" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-purple-500/50 transition-all outline-none" value={formData.price || ''} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 capitalize mb-2 tracking-wide px-1">Stock</label>
                  <input required type="number" placeholder="50" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-purple-500/50 transition-all outline-none" value={formData.stock || ''} onChange={e => setFormData({ ...formData, stock: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 capitalize mb-2 tracking-wide px-1">Description</label>
                  <textarea rows="4" placeholder="Tell something about this product..." className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-purple-500/50 transition-all outline-none" value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 capitalize mb-2 tracking-wide px-1">Product Image</label>
                  <div className="flex flex-col sm:flex-row items-center gap-6 bg-white/5 p-6 rounded-3xl border border-white/10">
                    <div className="w-24 h-24 rounded-2xl bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                      {formData.image ? (
                        <img 
                          src={formData.image instanceof File ? URL.createObjectURL(formData.image) : getMediaUrl(formData.image)} 
                          alt="Preview" 
                          onError={handleImageError}
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <FaPlus className="text-gray-700 text-3xl" />
                      )}
                    </div>
                    <div className="flex-1 w-full">
                      <input 
                        type="file" 
                        accept="image/*"
                        className="w-full text-xs text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:text-xs file:font-bold text-gray-200 file:capitalize file:bg-purple-500/20 file:text-purple-300 hover:file:bg-purple-500/30 cursor-pointer transition-all" 
                        onChange={e => setFormData({ ...formData, image: e.target.files[0] })} 
                      />
                      <p className="text-[10px] text-gray-500 mt-3 flex items-center gap-1.5 capitalize tracking-wider font-bold">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></span>
                        Will be automatically optimized to WebP
                      </p>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2 flex justify-end gap-2 mt-6">
                  <button type="button" onClick={() => setShowProductModal(false)} className="px-8 py-4 text-sm font-bold text-gray-400 hover:text-white capitalize tracking-wide transition-all">Cancel</button>
                  <button type="submit" disabled={uploading} className="px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-bold text-gray-200 capitalize tracking-wide shadow-xl shadow-purple-500/20 active:scale-95 disabled:opacity-50 transition-all">
                    {uploading ? 'Processing...' : (editingItem ? 'Update Product' : 'Create Product')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CATEGORY MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-dark w-full max-w-md rounded-3xl p-5 md:p-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6 underline decoration-teal-500 underline-offset-8">
              {editingItem ? 'Edit Category' : 'Add New Category'}
            </h3>
            <form onSubmit={handleCategorySubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 capitalize mb-2">Category Name</label>
                <input required className="w-full glass bg-white/5 border-white/10 rounded-xl p-3 text-white" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 capitalize mb-2">Slug</label>
                <input required className="w-full glass bg-white/5 border-white/10 rounded-xl p-3 text-white" value={formData.slug || ''} onChange={e => setFormData({ ...formData, slug: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 capitalize mb-2">Description</label>
                <textarea rows="3" className="w-full glass bg-white/5 border-white/10 rounded-xl p-3 text-white" value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 capitalize mb-2">Category Image</label>
                <div className="flex items-start space-x-4 bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="w-20 h-20 rounded-xl bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                    {formData.image ? (
                      <img 
                        src={formData.image instanceof File ? URL.createObjectURL(formData.image) : getMediaUrl(formData.image)} 
                        alt="Preview" 
                        onError={handleImageError}
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <FaTags className="text-gray-600 text-2xl" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input 
                      type="file" 
                      className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold text-gray-200 file:capitalize file:bg-teal-500/20 file:text-teal-300 hover:file:bg-teal-500/30 cursor-pointer" 
                      onChange={e => setFormData({ ...formData, image: e.target.files[0] })} 
                    />
                    <p className="text-[10px] text-gray-500 mt-2">Recommended: 800x800px or larger. PNG or JPG.</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <button type="button" onClick={() => setShowCategoryModal(false)} className="px-6 py-2 text-gray-400 hover:text-white">Cancel</button>
                <button type="submit" disabled={uploading} className="glass-button bg-teal-500/30 text-white px-8 py-2 rounded-full font-bold">
                  {uploading ? 'Processing...' : (editingItem ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* BANNERS TAB */}
      {activeTab === 'banners' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
            <h3 className="text-xl font-bold text-white px-2">Manage Hero Banners</h3>
            <button
              onClick={() => { setEditingItem(null); setFormData({ is_active: true, order: 0 }); setShowBannerModal(true); }}
              className="glass-button bg-orange-500/30 text-white px-5 py-2 rounded-xl font-bold flex items-center space-x-2 border-orange-500/30 hover:bg-orange-500/50"
            >
              <FaPlus className="text-sm" /> <span>Add Banner</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBanners.map(banner => (
              <motion.div 
                key={banner.id} 
                className="glass rounded-3xl overflow-hidden border border-white/5 group hover:border-white/10 transition-all"
                layout
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={getMediaUrl(banner.image)} 
                    alt={banner.title} 
                    onError={handleImageError}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                    <div>
                      <h4 className="text-xl font-bold text-white">{banner.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`h-2 w-2 rounded-full ${banner.is_active ? 'bg-green-400' : 'bg-red-400'}`}></span>
                        <span className="text-xs text-gray-300 font-bold capitalize">{banner.is_active ? 'Active' : 'Inactive'}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-300 font-bold capitalize">Order: {banner.order}</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button 
                      onClick={() => { setEditingItem(banner); setFormData(banner); setShowBannerModal(true); }}
                      className="p-2.5 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-xl text-white transition-colors"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => handleDeleteBanner(banner.id)}
                      className="p-2.5 bg-red-500/40 hover:bg-red-500/60 backdrop-blur-md rounded-xl text-white transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-400 text-sm line-clamp-2 mb-3">{banner.subtitle}</p>
                  <div className="flex items-center text-xs font-bold text-orange-400 capitalize tracking-wide bg-orange-400/10 w-max px-3 py-1 rounded-full">
                    Link: {banner.link || 'None'}
                  </div>
                </div>
              </motion.div>
            ))}
            {filteredBanners.length === 0 && (
              <div className="col-span-2 text-center py-20 glass rounded-3xl border-dashed border-white/10">
                <p className="text-gray-500 font-bold capitalize tracking-wide">No banners found</p>
                <button 
                  onClick={() => { setEditingItem(null); setFormData({ is_active: true, order: 0 }); setShowBannerModal(true); }}
                  className="mt-4 text-orange-400 hover:text-orange-300 font-bold text-gray-200 flex items-center justify-center space-x-2 mx-auto"
                >
                  <FaPlus /> <span>Create your first banner</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* BANNER MODAL */}
      {showBannerModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-dark w-full max-w-2xl rounded-3xl p-5 md:p-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6 underline decoration-orange-500 underline-offset-8">
              {editingItem ? 'Edit Hero Banner' : 'Create New Banner'}
            </h3>
            <form onSubmit={handleBannerSubmit} className="space-y-5 cursor-default">
              <div>
                <label className="block text-xs font-bold text-gray-400 capitalize mb-2">Banner Title</label>
                <input required className="w-full bg-[#1a2c33] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500 transition-colors" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 capitalize mb-2">Display Order</label>
                  <input type="number" className="w-full bg-[#1a2c33] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500 transition-colors" value={formData.order || 0} onChange={e => setFormData({ ...formData, order: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 capitalize mb-2">Status</label>
                  <div className="relative">
                    <select 
                      className="w-full bg-[#1a2c33] border border-white/10 rounded-xl p-3 text-white appearance-none focus:outline-none focus:border-orange-500 transition-colors cursor-pointer" 
                      value={formData.is_active} 
                      onChange={e => setFormData({ ...formData, is_active: e.target.value === 'true' })}
                    >
                      <option value="true" className="bg-[#1a2c33]">Active / Visible</option>
                      <option value="false" className="bg-[#1a2c33]">Hidden / Inactive</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 capitalize mb-2">Link (Optional)</label>
                <input className="w-full bg-[#1a2c33] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500 transition-colors" value={formData.link || ''} onChange={e => setFormData({ ...formData, link: e.target.value })} placeholder="/shop or https://..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 capitalize mb-2">Banner Image</label>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-12 rounded-lg bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                      {formData.image ? (
                        <img src={formData.image instanceof File ? URL.createObjectURL(formData.image) : getMediaUrl(formData.image)} alt="Preview" onError={handleImageError} className="w-full h-full object-cover" />
                      ) : (
                        <FaShoppingBag className="text-gray-600" />
                      )}
                    </div>
                    <input 
                      type="file" 
                      className="flex-1 text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold text-gray-200 file:capitalize file:bg-orange-500/20 file:text-orange-300 hover:file:bg-orange-500/30 cursor-pointer" 
                      onChange={e => setFormData({ ...formData, image: e.target.files[0] })} 
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6 border-t border-white/5 pt-6">
                <button type="button" onClick={() => setShowBannerModal(false)} className="px-6 py-2 text-gray-400 hover:text-white font-bold capitalize text-xs tracking-widest">Cancel</button>
                <button type="submit" disabled={uploading} className="glass bg-orange-500/20 hover:bg-orange-500/30 text-white px-8 py-3 rounded-xl font-bold text-gray-200 capitalize tracking-wide transition-all active:scale-95 border border-orange-500/30">
                  {uploading ? 'Publishing...' : (editingItem ? 'Update Banner' : 'Create Banner')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
