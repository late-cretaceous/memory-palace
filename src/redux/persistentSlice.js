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
      const id = action.payload;
      const removee = state[id];
      const descendants = removee.listHierarchy();
      descendants.forEach((descendant) => {
        delete state[descendant.id];
      });

      const parent = state[removee.parent.id];
      parent.remove(id);

      delete state[id];
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
