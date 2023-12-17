import { configureStore, combineReducers } from "@reduxjs/toolkit";
import labelSlice from "./labelSlice";
import persistentSlice from "./persistentSlice";
import transientSlice from "./transientSlice";
import globalSlice from "./globalSlice";

const store = configureStore({
  reducer: combineReducers({
    persistentSlice,
    transientSlice,
    labelSlice,
    globalSlice,
  }),
});

export default store;
