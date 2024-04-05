import {combineReducers} from '@reduxjs/toolkit';

import cartReducer from './slices/order.slice';

const combinedReducer = combineReducers({
  cart: cartReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'auth/logOut') {
    state = undefined;
  }

  return combinedReducer(state, action);
};

export default rootReducer;
