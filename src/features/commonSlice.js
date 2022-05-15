import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  querySearch: null,
  loading: false,
  error: undefined,
  visibleModalLogin: false,
};

const commonSlices = createSlice({
  name: 'common',
  initialState,
  reducers: {
    changeQuery: (state, action) => {
      state.querySearch = action.payload;
    },
    toggleModalLogin: (state, action) => {
      state.visibleModalLogin = !state.visibleModalLogin;
    },
  },
});
//actions
export const commonActions = commonSlices.actions;

export const { toggleModalLogin, changeQuery } = commonActions;
//selectors
export const commonSelectors = (state) => state.common;
export const visibleModalLoginSelector = (state) =>
  state.common.visibleModalLogin;

//reducer
const commonReducer = commonSlices.reducer;
export default commonReducer;
