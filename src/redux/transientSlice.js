import { createSlice } from "@reduxjs/toolkit";

const createTransientTodo = (initialValues) => {
  const defaultValues = {
    id: initialValues.id,
    listOpen: false,
    hover: false,
    isStarter: false,
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
      const id = action.payload.id;

      action.payload.descendants.forEach(
        (descendant) => delete state[descendant]
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
  },
});

export const {
  addTransientTodo,
  removeTransientTodo,
  toggleListOpen,
  toggleHover,
} = transientSlice.actions;
export default transientSlice.reducer;
