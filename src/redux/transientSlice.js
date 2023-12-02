import { createSlice } from "@reduxjs/toolkit";

const createTransientTodo = (initialValues) => {
  const defaultValues = {
    id: initialValues.id,
    listOpen: false,
    hover: false,
    isStarter: false,
    hadStarter: false,
    listPulled: false,
  };

  return Object.assign(defaultValues, initialValues);
};

const transientSlice = createSlice({
  name: "transientTodos",
  initialState: {},
  reducers: {
    addTransientTodo: (state, action) => {
      state[action.payload.id] = createTransientTodo(action.payload);
    },
    removeTransientTodo: (state, action) => {
      const id = action.payload;

      action.payload.descendants.forEach(
        (id) => delete state[id]
      );

      delete state[id];
    },
    toggleListOpen: (state, action) => {
      state[action.payload].listOpen = !state[action.payload].listOpen;
    },
    toggleHover: (state, action) => {
      const { id, hovering } = action.payload;
      state[id].hover = hovering;
    },
    toggleStarter: (state, action) => {
      const { id, value } = action.payload;
      state[id].isStarter = value;
    },
    editTransientTodo: (state, action) => {
      const { id, edit } = action.payload;

      const newTodo = { ...state[id], ...edit };
      state[id] = newTodo;
    },
  },
});

export const {
  addTransientTodo,
  removeTransientTodo,
  toggleListOpen,
  toggleHover,
  toggleStarter,
  editTransientTodo
} = transientSlice.actions;
export default transientSlice.reducer;
