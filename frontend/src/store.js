import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import userReducer from './slices/userSlice';
import bannerReducer from './slices/bannerSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    banners: bannerReducer,
  },
});
