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
      const removee = state[action.payload.id];
      const updatedFamily = forgetChild(state[removee.parent], id, state);
      mergeToStateAndStore(state, updatedFamily);

      delete state[id];
      removeFromStorage(id);
    },
    moveTodo: (state, action) => {
      const e = action.payload.e;
      const parent = state[state[e.draggableId].parent];
      const reorderedTodos = action.payload.reorderedTodos;

      if (!e.destination) return;

      // Probably will not need to update the parent's list when you use the transient position property
      const updatedFamily = {
        [parent.id]: { ...parent, list: Object.keys(reorderedTodos) },
        ...reorderedTodos,
      };
      
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
  moveTodo,
  editTodo,
  addExistingTodo,
} = persistentSlice.actions;

export default persistentSlice.reducer;
