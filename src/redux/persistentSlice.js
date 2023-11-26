import { createSlice } from "@reduxjs/toolkit";
import { loadTodos } from "../utilities/reduxUtils";
import TodoKit from "../utilities/storage";

const persistentSlice = createSlice({
  name: "persistentTodos",
  initialState: {},
  reducers: {
    addPersistentTodo: (state, action) => {
      const todo = action.payload;
      state[todo.id] = todo;
      if (todo.parent) {
        state[todo.parent].add(todo.id, state);
      }
    },
    removePersistentTodo: (state, action) => {   
      action.payload.descendants.forEach((descendant) => {
        delete state[descendant.id];
      });
    
      const id = action.payload.id;
      const removee = state[action.payload.id];
      const parent = state[removee.parent];
      parent.remove(id, state);
    
      delete state[id];
    },
    moveTodo: (state, action) => {
      const e = action.payload;

      if (!e.destination) return;

      const todo = state[e.draggableId];
      state[todo.parent].move(e.source.index, e.destination.index, state);

      return { ...state };
    },
    editTodo: (state, action) => {
      const { id, edit } = action.payload;

      state[id] = new TodoKit({ ...state[id], ...edit });
    },
  },
});

export const { addPersistentTodo, removePersistentTodo, moveTodo, editTodo } =
  persistentSlice.actions;

export default persistentSlice.reducer;
