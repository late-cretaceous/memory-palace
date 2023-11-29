import { createSlice } from "@reduxjs/toolkit";
import { includeChild, moveChild, forgetChild } from "../utilities/todoUtils";

const persistentSlice = createSlice({
  name: "persistentSlice",
  initialState: {},
  reducers: {
    addPersistentTodo: (state, action) => {
      const todo = action.payload;
      state[todo.id] = todo;
      if (todo.parent) {
        const updatedFamily = includeChild(state[todo.parent], todo.id, state);
        Object.assign(state, updatedFamily);
      }
    },
    removePersistentTodo: (state, action) => {
      action.payload.descendants.forEach((descendant) => {
        delete state[descendant.id];
      });

      const id = action.payload.id;
      const removee = state[action.payload.id];
      const updatedFamily = forgetChild(state[removee.parent], id, state);
      Object.assign(state, updatedFamily);

      delete state[id];
    },
    moveTodo: (state, action) => {
      const e = action.payload;
      const parentId = state[e.draggableId].parent;

      if (!e.destination) return;

      const updatedFamily = moveChild(
        parentId,
        e.source.index,
        e.destination.index,
        state
      );

      Object.assign(state, updatedFamily);
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
