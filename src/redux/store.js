import { configureStore, combineReducers } from "@reduxjs/toolkit";
import labelSlice from "./labelSlice";
import persistentSlice from "./persistentSlice";

const store = configureStore({
  reducer: combineReducers({ persistentSlice, labelSlice }),
});

export default store;
