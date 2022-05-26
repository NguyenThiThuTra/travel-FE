import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';
import reviewApi from 'api/reviewApi';

export const getAllReviews = createAsyncThunk(
  'reviews/getAllReviews',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await reviewApi.getAllReviews(payload);
      return response;
    } catch (error) {
      message.error(error?.response?.data?.message);
      return rejectWithValue(error?.response.data);
    }
  }
);

export const getReview = createAsyncThunk(
  'reviews/getReview',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await reviewApi.getReview(payload);
      return response;
    } catch (error) {
      message.error(error?.response?.data?.message);
      return rejectWithValue(error?.response.data);
    }
  }
);

export const postReview = createAsyncThunk(
  'reviews/postReview',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await reviewApi.postReview(payload);
      return response;
    } catch (error) {
      message.error(error?.response?.data?.message);
      return rejectWithValue(error?.response.data);
    }
  }
);

const initialState = {
  reviews: null,
  review: null,
};
const reviewsSlices = createSlice({
  name: 'reviews',
  initialState,
  reducers: {},
  extraReducers: {
    // getAllReviews
    [getAllReviews.fulfilled]: (state, action) => {
      state.reviews = action.payload;
    },
    [getAllReviews.rejected]: (state, action) => {
      state.reviews = null;
    },
    // getReview
    [getReview.fulfilled]: (state, action) => {
      state.review = action.payload;
    },
    [getReview.rejected]: (state, action) => {
      state.review = null;
    },
  },
});
//actions
export const reviewsActions = reviewsSlices.actions;

//selectors
export const useReviewsSelector = (state) => state.reviews;
export const useDataReviewsSelector = (state) => state.reviews.reviews;
export const useDataReviewSelector = (state) => state.reviews.review;

//reducer
const reviewsReducer = reviewsSlices.reducer;
export default reviewsReducer;
