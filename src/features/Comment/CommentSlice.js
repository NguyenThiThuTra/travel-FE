import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';
import commentApi from 'api/comment';
export const addCommentInHomestay = createAsyncThunk(
  'comments/addCommentInHomestay',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await commentApi.addCommentInHomestay(payload);
      return response;
    } catch (error) {
      message.error(error?.response?.data?.message);
      return rejectWithValue(error?.response.data);
    }
  }
);
export const getAllCommentInHomestay = createAsyncThunk(
  'comments/getAllCommentInHomestay',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await commentApi.getAllCommentInHomestay(payload);
      return response;
    } catch (error) {
      message.error(error?.response?.data?.message);
      return rejectWithValue(error?.response.data);
    }
  }
);
export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await commentApi.updateComment(payload);
      return response;
    } catch (error) {
      message.error(error?.response?.data?.message);
      return rejectWithValue(error?.response.data);
    }
  }
);

const initialState = {
  comments: null,
  commentPost: null,
  commentUpdate: null,
  loading: false,
  error: undefined,
};
const commentSlices = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: {
    // getAllCommentInHomestay
    [getAllCommentInHomestay.fulfilled]: (state, action) => {
      state.comments = action.payload;
      state.error = undefined;
      state.loading = false;
    },
    [getAllCommentInHomestay.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getAllCommentInHomestay.pending]: (state, action) => {
      state.loading = true;
      state.error = undefined;
    },
    // addCommentInHomestay
    [addCommentInHomestay.fulfilled]: (state, action) => {
      state.commentPost = action.payload;
      state.error = undefined;
      state.loading = false;
    },
    [addCommentInHomestay.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [addCommentInHomestay.pending]: (state, action) => {
      state.loading = true;
      state.error = undefined;
    },
    // updateComment
    [updateComment.fulfilled]: (state, action) => {
      state.commentUpdate = action.payload;
      state.error = undefined;
      state.loading = false;
    },
    [updateComment.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.commentUpdate = null;
    },
    [updateComment.pending]: (state, action) => {
      state.loading = true;
      state.error = undefined;
    },
  },
});
//actions
export const commentActions = commentSlices.actions;


//selectors
export const useCommentPostSelector = (state) => state.comments.commentPost;
export const useCommentUpdateSelector = (state) => state.comments.commentUpdate;
export const useCommentsSelector = (state) => state.comments.comments;
export const useLoadingCommentSelector = (state) => state.comments.loading;
//reducer
const commentReducer = commentSlices.reducer;
export default commentReducer;
