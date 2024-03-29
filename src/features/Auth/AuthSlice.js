import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { notification } from 'antd';
import { PERMISSIONS } from 'constants/permissions';
import { setLoadingApp } from 'features/commonSlice';
import jwt_decode from 'jwt-decode';
import authApi from '../../api/authApi';
import userApi from '../../api/userApi';

export function detectLogin() {
  const token = localStorage.getItem('access_token');
  if (token) {
    const decodedToken = jwt_decode(token);
    
    const currentDate = new Date();
    // JWT exp is in seconds
    if (decodedToken.exp * 1000 < currentDate.getTime()) {
      return false;
    } else {
      return { isLoggedIn: true, user_id: decodedToken.id };
    }
  }
  return false;
}
export const login = createAsyncThunk(
  'auth/login',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const response = await authApi.login(payload);
      const permissions = await response?.data?.roles;
      if (permissions !== PERMISSIONS.user) {
        dispatch(setLoadingApp(false));
        notification.error({
          message:
            'Đăng nhập thất bại, vui lòng kiểm tra lại email và password !',
          duration: 1.5,
          style: { backgroundColor: '#f8d7da' },
        });
        return false;
      }
      localStorage.setItem('access_token', response.token);
      notification.success({
        message: 'Đăng nhập thành công !',
        duration: 1.5,
        style: { backgroundColor: '#d4edda' },
      });
      dispatch(setLoadingApp(false));
      return response;
    } catch (error) {
      dispatch(setLoadingApp(false));
      notification.error({
        message:
          'Đăng nhập thất bại, vui lòng kiểm tra lại email và password !',
        duration: 1.5,
        style: { backgroundColor: '#f8d7da' },
      });
      return rejectWithValue(error?.response.data);
    }
  }
);
export const signup = createAsyncThunk(
  'auth/signup',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const response = await authApi.signup(payload);
      localStorage.setItem('access_token', response.token);
      notification.success({
        message: 'Đăng ký thành công !',
        duration: 1.5,
        style: { backgroundColor: '#d4edda' },
      });
      dispatch(setLoadingApp(false));
      return response;
    } catch (error) {
      dispatch(setLoadingApp(false));
      notification.error({
        message: 'Đăng ký thất bại !',
        duration: 1.5,
        style: { backgroundColor: '#f8d7da' },
      });
      return rejectWithValue(error?.response.data);
    }
  }
);
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingApp(true));
      const login = detectLogin();
      if (login.isLoggedIn && login.user_id) {
        const response = await userApi.getUser(login.user_id);
        const permissions = await response?.data?.roles;
        if (permissions !== PERMISSIONS.user) {
          notification.error({
            message:
              'Đăng nhập thất bại, vui lòng kiểm tra lại email và password !',
            duration: 1.5,
            style: { backgroundColor: '#f8d7da' },
          });
          dispatch(logout());
          dispatch(setLoadingApp(false));
          return false;
        }
        dispatch(setLoadingApp(false));
        return response;
      }
      dispatch(setLoadingApp(false));
      return null;
    } catch (error) {
      dispatch(setLoadingApp(false));
      notification.error({
        message: 'Call api error !',
        duration: 1.5,
        style: { backgroundColor: '#f8d7da' },
      });
      return rejectWithValue(error?.response.data);
    }
  }
);

const initialState = {
  currentUser: null,
  loading: false,
  error: undefined,
  isLoggedIn: detectLogin()?.isLoggedIn,
};
const authSlices = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      localStorage.removeItem('access_token');
      state.loading = false;
      state.currentUser = undefined;
      state.error = undefined;
    },
  },
  extraReducers: {
    //login
    [login.fulfilled]: (state, action) => {
      if (action.payload) {
        state.isLoggedIn = true;
        state.currentUser = action.payload;
      }
      state.error = undefined;
      state.loading = false;
    },
    [login.rejected]: (state, action) => {
      state.isLoggedIn = false;
      state.loading = false;
      state.error = action.payload;
    },
    [login.pending]: (state, action) => {
      state.loading = true;
      state.error = undefined;
    },
    //signup
    [signup.fulfilled]: (state, action) => {
      state.isLoggedIn = true;
      state.currentUser = action.payload;
      state.error = undefined;
      state.loading = false;
    },
    [signup.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [signup.pending]: (state, action) => {
      state.loading = true;
      state.error = undefined;
    },
    // getCurrentUser
    [getCurrentUser.fulfilled]: (state, action) => {
      state.currentUser = action.payload;
      state.error = undefined;
      state.loading = false;
    },
    [getCurrentUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getCurrentUser.pending]: (state, action) => {
      state.loading = true;
      state.error = undefined;
    },
  },
});
//actions
export const authActions = authSlices.actions;
export const { logout } = authActions;
//selectors
export const useCurrentUserSelector = (state) => state.auth.currentUser;

//reducer
const authReducer = authSlices.reducer;
export default authReducer;
