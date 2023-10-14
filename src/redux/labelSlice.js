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

console.log(labelSlice);

export const { toggle } = labelSlice.actions;
export default labelSlice.reducer;
