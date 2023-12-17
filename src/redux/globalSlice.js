import { createSlice } from "@reduxjs/toolkit";

const globalSlice = createSlice({
  name: "globalSlice",
  initialState: { sort: "manual" },
  reducers: {
    sort: (state, action) => {
        state.sort = action.payload;
    }
  }
});

export const { sort } = globalSlice.actions;

export default globalSlice.reducer;