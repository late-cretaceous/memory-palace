import { createSlice } from "@reduxjs/toolkit";
import { includeChild, moveChild, forgetChild } from "../utilities/todoUtils";

const persistentSlice = createSlice({
  name: "persistentTodos",
  initialState: {},
  reducers: {
    addPersistentTodo: (state, action) => {
      const todo = action.payload;
      state[todo.id] = todo;
      if (todo.parent) {
        state[todo.parent] = includeChild(state[todo.parent], todo.id, state);
      }
    },
    removePersistentTodo: (state, action) => {
      action.payload.descendants.forEach((descendant) => {
        delete state[descendant.id];
      });

      const id = action.payload.id;
      const removee = state[action.payload.id];
      const parent = state[removee.parent];
      state[removee.parent] = forgetChild(parent, id);

      delete state[id];
    },
    moveTodo: (state, action) => {
      const e = action.payload;
      const parentId = state[e.draggableId].parent;

      if (!e.destination) return;

      state[parentId] = moveChild(
        state[parentId],
        e.source.index,
        e.destination.index
      );
    },
    editTodo: (state, action) => {
      const { id, edit } = action.payload;

      state[id] = { ...state[id], ...edit };
    },
  },
});

export const { addPersistentTodo, removePersistentTodo, moveTodo, editTodo } =
  persistentSlice.actions;

export default persistentSlice.reducer;
