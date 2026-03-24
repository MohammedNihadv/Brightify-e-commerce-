import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchBanners = createAsyncThunk('banners/fetchAll', async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/products/banners/`);
    return data;
});

export const fetchAdminBanners = createAsyncThunk('banners/fetchAdmin', async (_, { getState }) => {
    const { user: { userInfo } } = getState();
    const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` }
    };
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/products/banners/admin/`, config);
    return data;
});

const bannerSlice = createSlice({
    name: 'banners',
    initialState: {
        banners: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBanners.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBanners.fulfilled, (state, action) => {
                state.loading = false;
                state.banners = action.payload;
            })
            .addCase(fetchBanners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchAdminBanners.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAdminBanners.fulfilled, (state, action) => {
                state.loading = false;
                state.banners = action.payload;
            })
            .addCase(fetchAdminBanners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default bannerSlice.reducer;
