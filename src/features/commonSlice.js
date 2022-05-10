import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  querySearch: null,
  loading: false,
  error: undefined,
};

const commonSlices = createSlice({
  name: 'common',
  initialState,
  reducers: {
    changeQuery: (state, action) => {
      state.querySearch = action.payload;
    },
  },
});
//actions
export const commonActions = commonSlices.actions;

//selectors

//reducer
const commonReducer = commonSlices.reducer;
export default commonReducer;
