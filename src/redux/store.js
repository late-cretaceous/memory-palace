import { configureStore } from '@reduxjs/toolkit';
import labelReducer from './labelSlice';

const store = configureStore({
  reducer: {
    labels: labelReducer
  }
});

export default store;