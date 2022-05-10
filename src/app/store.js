import {
  combineReducers,
  configureStore,
  createAction,
} from '@reduxjs/toolkit';
import usersReducer from 'features/Users/UsersSlice';
import homestayReducer from 'features/Homestay/HomestaySlice';
import destinationsReducer from 'features/Destinations/DestinationsSlice';
import roomsReducer from 'features/Rooms/RoomsSlice';
import authReducer from 'features/Auth/AuthSlice';
import orderReducer from 'features/Order/OrderSlice';
import commentReducer from 'features/Comment/CommentSlice';
import paymentReducer from 'features/Payment/PaymentSlice';
const rootReducer = combineReducers({
  users: usersReducer,
  homestay: homestayReducer,
  destination: destinationsReducer,
  room: roomsReducer,
  auth: authReducer,
  order: orderReducer,
  comments: commentReducer,
  payment: paymentReducer,
});

export const resetAction = createAction('reset');

const resettableReducer = (state, action) => {
  if (action.type === 'auth/logout') {
    return rootReducer(undefined, action);
  }
  return rootReducer(state, action);
};
export const store = configureStore({
  reducer: resettableReducer,
});
