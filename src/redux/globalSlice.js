import { createSlice } from "@reduxjs/toolkit";

const globalSlice = createSlice({
  name: "globalSlice",
  initialState: { sort: "manual" },
  reducers: {
    sort: (state, action) => {
      state.sort = state.sort === action.payload ? "manual" : action.payload;
    },
  },
});

export const { sort } = globalSlice.actions;

export default globalSlice.reducer;
