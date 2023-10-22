import { createSlice } from "@reduxjs/toolkit";
import { loadTodos } from "../utilities/reduxStorage";

const persistentSlice = createSlice({
  name: "persistentTodos",
  initialState: loadTodos(),
  reducers: {
    addTodo: (state, action) => {
      state.push(action.payload);
    },
    removeTodo: (state, action) => {
      const removeeId = action.payload;
      const removeeIndex = state.findIndex(
        (todo) => todo.id === removeeId
      );

      if (removeeIndex !== -1) {
        state.splice(removeeIndex, 1);
      }
    },
  },
});

export const { toggle } = persistentSlice.actions;
export default persistentSlice.reducer;
