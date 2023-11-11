import { configureStore, combineReducers } from "@reduxjs/toolkit";
import labelSlice from "./labelSlice";
import persistentSlice from "./persistentSlice";
import transientSlice from "./transientSlice";

const store = configureStore({
  reducer: combineReducers({ persistentSlice, transientSlice, labelSlice }),
});

export default store;
