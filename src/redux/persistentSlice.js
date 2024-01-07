import { createSlice } from "@reduxjs/toolkit";
import { includeChild, forgetChild } from "../utilities/todoUtils";
import {
  addToStorage,
  mergeToStateAndStore,
  removeFromStorage,
} from "../utilities/databaseUtils";

const persistentSlice = createSlice({
  name: "persistentSlice",
  initialState: {},
  reducers: {
    addPersistentTodo: (state, action) => {
      const todo = action.payload;
      state[todo.id] = todo;
      if (todo.parent) {
        const updatedFamily = includeChild(state[todo.parent], todo.id, state);
        mergeToStateAndStore(state, updatedFamily);
      } else {
        addToStorage(todo);
      }
    },
    removePersistentTodo: (state, action) => {
      action.payload.descendants.forEach((id) => {
        delete state[id];
        removeFromStorage(id);
      });

      const id = action.payload.id;


      delete state[id];
      removeFromStorage(id);
    },
    updateStateAndStore: (state, action) => {
      const updatedFamily = action.payload;
      mergeToStateAndStore(state, updatedFamily);
    },
    editTodo: (state, action) => {
      const { id, edit } = action.payload;

      const newTodo = { ...state[id], ...edit };
      state[id] = newTodo;
      addToStorage(newTodo);
    },
    addExistingTodo: (state, action) => {
      const todo = action.payload;
      state[todo.id] = todo;
    },
  },
});

export const {
  addPersistentTodo,
  removePersistentTodo,
  editTodo,
  addExistingTodo,
  updateStateAndStore,
} = persistentSlice.actions;

export default persistentSlice.reducer;
