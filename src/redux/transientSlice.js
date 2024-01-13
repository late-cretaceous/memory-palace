import { createSlice } from "@reduxjs/toolkit";
import { loadTodoKeys } from "../utilities/reduxUtils";

const createTransientTodo = (initialValues) => {
  const defaultValues = {
    id: initialValues.id,
    listOpen: false,
    hover: false,
    isStarter: false,
    hadStarter: false,
    listPulled: false,
    edgeActivated: false,
    inCascade: false,
    position: null,
  };

  return Object.assign(defaultValues, initialValues);
};

const editTodo = (state, id, edit) => {
  return { ...state[id], ...edit };
};

const transientSlice = createSlice({
  name: "transientTodos",
  initialState: {},
  reducers: {
    addTransientTodo: (state, action) => {
      state[action.payload.id] = createTransientTodo(action.payload);
    },
    toggleListOpen: (state, action) => {
      state[action.payload].listOpen = !state[action.payload].listOpen;
    },
    editTransientTodo: (state, { payload: { id, edit } }) => {
      state[id] = editTodo(state, id, edit);
    },
    editTransientTodos: (state, { payload: edits }) => {
      edits.forEach(({ id, edit }) => {
        if (!state[id]) {
          state[id] = createTransientTodo({ id });
        }

        state[id] = editTodo(state, id, edit);
      });
    },
    trimTransientSlice: (state) => {
      const transientSliceKeys = Object.keys(state);
      const localStorageKeys = loadTodoKeys();

      const transientSliceKeysToRemove = transientSliceKeys.filter(
        (key) => !localStorageKeys.includes(key)
      );

      transientSliceKeysToRemove.forEach((key) => delete state[key]);
    },
    sortTransientTodos: (state, { payload: { todos, sort } }) => {
      const sortedList =
        sort === "manuel"
          ? todos
          : Array.from(todos).sort(
              (a, b) => a.message.length - b.message.length
            );
      
      const sortedIDs = sortedList.map((todo) => todo.id);

      sortedIDs.forEach((id, index) => {
        state[id].position = index;
      });
    },
  },
});

export const {
  addTransientTodo,
  removeTransientTodo,
  toggleListOpen,
  editTransientTodo,
  editTransientTodos,
  trimTransientSlice,
  sortTransientTodos,
} = transientSlice.actions;
export default transientSlice.reducer;
