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
        const list = state[todo.parent.id].list;
        list.splice(todo.index, 0, todo);
        list.forEach((todo, index) => (todo.index = index));
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
