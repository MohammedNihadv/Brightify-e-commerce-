import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../slices/cartSlice';
import { FaTrash } from 'react-icons/fa';
import { getMediaUrl, handleImageError } from '../utils/mediaUtils';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const userLoginState = useSelector((state) => state.user);
  const { userInfo } = userLoginState;

  const checkoutHandler = () => {
    if (userInfo) {
      navigate('/shipping');
    } else {
      navigate('/login?redirect=shipping');
    }
  };

  return (
    <div className="animate-fade-in max-w-[1400px] mx-auto py-4 md:py-12 px-4 md:px-8">
      <h1 className="text-2xl md:text-5xl font-bold mb-6 md:mb-16 tracking-tight">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="glass p-6 md:p-12 text-center rounded-2xl md:rounded-3xl">
          <h2 className="text-lg md:text-2xl text-gray-300 mb-4 md:mb-6">Your cart is empty.</h2>
          <Link to="/" className="glass-button px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-lg inline-block">
            Go Back to Shop
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="glass rounded-2xl md:rounded-3xl p-3 md:p-8 space-y-3 md:space-y-6">
              {cartItems.map((item) => (
                <div key={item.product} className="flex items-center pb-3 md:pb-6 border-b border-white/10 last:border-b-0 last:pb-0 gap-3 md:gap-6">
                  {/* Image */}
                  <div className="w-20 h-20 md:w-32 md:h-32 flex-shrink-0">
                    <img 
                      src={getMediaUrl(item.image)} 
                      onError={handleImageError}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-xl shadow-lg border border-white/5"
                    />
                  </div>

                  {/* Name & Price */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <Link to={`/product/${item.slug}`} className="text-sm md:text-xl font-bold hover:text-teal-300 transition-colors line-clamp-2 leading-tight mb-1 md:mb-2 text-white">
                      {item.name}
                    </Link>
                    <div className="text-xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-300">
                      ₹{item.price}
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-6 shrink-0">
                    <select
                      className="glass-select px-2 md:px-3 py-1.5 md:py-2 w-16 md:w-24 text-center text-xs md:text-base font-bold"
                      value={item.qty}
                      onChange={(e) => dispatch(addToCart({ ...item, qty: Number(e.target.value) }))}
                    >
                      {[...Array(Math.max(0, Math.floor(Number(item.stock) || 0))).keys()].map((x) => (
                        <option key={x + 1} value={x + 1} className="text-black">
                          {x + 1}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      className="text-red-400/70 hover:text-red-400 p-2 md:p-3 rounded-xl hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
                      onClick={() => removeFromCartHandler(item.product)}
                    >
                      <FaTrash className="text-xs md:text-lg" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:w-1/3">
            <div className="glass rounded-2xl md:rounded-3xl p-4 md:p-8 sticky top-24">
              <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-6 pb-3 md:pb-4 border-b border-white/10">Order Summary</h2>
              
              <div className="flex justify-between mb-3 md:mb-4 text-gray-300 text-sm md:text-base">
                <span>Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})</span>
                <span className="text-white font-bold tracking-wider text-base md:text-xl">
                  ₹{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                </span>
              </div>
              
              <div className="mt-4 md:mt-8 pt-4 md:pt-6 border-t border-white/10">
                <button
                  type="button"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                  className="w-full bg-gradient-to-r from-blue-500 hover:from-blue-600 to-purple-600 hover:to-purple-700 text-white font-bold py-3 md:py-4 rounded-xl shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
