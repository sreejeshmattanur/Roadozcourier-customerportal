import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

// Helper to get user from localStorage safely on initial load
const getStoredUser = () => {
  const user = localStorage.getItem('user');
  try {
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
};

const initialState = {
  user: getStoredUser(),
  token: Cookies.get('access_token') || null,
  isAuthenticated: !!Cookies.get('access_token'),
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { token, user } = action.payload;
      state.loading = false;
      state.isAuthenticated = true;
      state.token = token;
      state.user = user;
      
      // 1. Save token to Cookies (for API interceptor)
      const cleanToken = token.toString().replace(/['"]+/g, '').trim();
      Cookies.set('access_token', cleanToken, { expires: 7 });

      // 2. Save user object to LocalStorage (to persist name on refresh)
      localStorage.setItem('user', JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      Cookies.remove('access_token');
      localStorage.removeItem('user');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;