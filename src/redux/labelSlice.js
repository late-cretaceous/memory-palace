import { createSlice } from "@reduxjs/toolkit";

const labelSlice = createSlice({
  name: "label",
  initialState: { visible: false },
  reducers: {
    toggle: (state) => {
      state.visible = !state.visible;
    },
  },
});

export const { toggle } = labelSlice.actions;
export default labelSlice.reducer;
