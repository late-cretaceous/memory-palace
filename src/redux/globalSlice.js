import { createSlice } from "@reduxjs/toolkit";

const globalSlice = createSlice({
  name: "globalSlice",
  initialState: {
    sort: "manual",
    sorted: false,
    cascadePhase: "off",
    headerColorNegative: false,
    backgroundColorNegative: false,
  },
  reducers: {
    sort: (state, action) => {
      state.sort = action.payload;

      if (action.payload !== "manual") {
        state.sorted = true;
      } else {
        state.sorted = false;
      }
    },
    toggleColorNegative: (state, { payload: { area } }) => {
      state[area] = !state[area];
    },
    setCascadePhase: (state, action) => {
      state.cascadePhase = action.payload;
    },
  },
});

export const { sort, toggleColorNegative, setCascadePhase } =
  globalSlice.actions;

export default globalSlice.reducer;
