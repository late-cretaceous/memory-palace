import { createSlice } from "@reduxjs/toolkit";
import { loadTodos } from "../utilities/reduxStorage";

const persistentSlice = createSlice({
  name: "persistentTodos",
  initialState: {},
  reducers: {
    addTodo: (state, action) => {
      const todo = action.payload;
      state[todo.id] = todo;
      if(todo.parent) {
        todo.parent.add(todo);
      }
    },
    removeTodo: (state, action) => {
      delete state[action.payload.id];
    },
    updateTodo: (state, action) => {
      const { id, updates } = action.payload;
      const todo = state[id];
      if (todo) {
        Object.assign(todo, updates);
      }
    },
  },
});

export const { addTodo, removeTodo, updateTodo } = persistentSlice.actions;

export default persistentSlice.reducer;
