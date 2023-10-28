import { createSlice } from "@reduxjs/toolkit";
import { loadTodos } from "../utilities/reduxStorage";

export const addTodo = (todo) => ({
  type: 'persistentTodos/addTodo',
  payload: todo,
});

export const updateTodo = (id, updates) => ({
  type: 'persistentTodos/updateTodo',
  payload: { id, updates },
});

export const removeTodo = (id) => ({
  type: 'persistentTodos/removeTodo',
  payload: id,
});

const persistentSlice = createSlice({
  name: "persistentTodos",
  initialState: {},
  reducers: {
    addTodo: (state, action) => {
      const todo = action.payload;
      state[todo.id] = todo;
      if(todo.parent) {
        state[todo.parent.id].list.push(todo);
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

export default persistentSlice.reducer;
