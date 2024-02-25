import { createSlice } from "@reduxjs/toolkit";
import {
  addToStorage,
  mergeToStateAndStore,
  removeFromStorage,
} from "../utilities/databaseUtils";

const persistentSlice = createSlice({
  name: "persistentSlice",
  initialState: {},
  reducers: {
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
      console.log("editTodo action", action);
      const { id, edit } = action.payload;
      console.log("editTodo", id, edit);

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
  removePersistentTodo,
  editTodo,
  addExistingTodo,
  updateStateAndStore,
} = persistentSlice.actions;

export default persistentSlice.reducer;
