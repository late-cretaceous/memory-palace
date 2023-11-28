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

      if (!e.destination) return;

      const todo = state[e.draggableId];
      console.log(`Draggable ID from move function. Is it a todo Id? If so you can simplify: ${e.draggableId}`);
      state.persistentSlice[todo.id] = moveChild(
        state.persistentSlice[todo.id],
        e.source.index,
        e.destination.index,
        state
      );

      return { ...state };
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
