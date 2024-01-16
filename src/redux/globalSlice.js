import { createSlice } from "@reduxjs/toolkit";

const globalSlice = createSlice({
  name: "globalSlice",
  initialState: {
    sort: "manual",
    headerColorNegative: false,
    backgroundColorNegative: false,
  },
  reducers: {
    sort: (state, action) => {
      state.sort = state.sort === action.payload ? "manual" : action.payload;
    },
    toggleColorNegative: (state, { payload: { area } }) => {
      state[area] = !state[area];
    },
  },
});

export const { sort, toggleColorNegative } = globalSlice.actions;

export default globalSlice.reducer;
