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
    edgeActivated: { top: false, bottom: false },
    inCascade: false,
    position: null,
    colorNegative: false,
    previousColorString: "hsl(0, 0%, 0%)",
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
    toggleTransientColorNegative: (state, { payload: { id } }) => {
      state[id].colorNegative = !state[id].colorNegative;
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
    addTransientAndReorder: (
      state,
      { payload: { todos, newIdAndPosition: newTodoInfo } }
    ) => {
      console.log(`newTodoInfo: ${newTodoInfo.id} ${newTodoInfo.position}`);
      Object.values(todos).forEach((todo) => {
        if (todo.id === newTodoInfo.id) {
          state[todo.id] = createTransientTodo({
            id: todo.id,
            position: newTodoInfo.position,
          });
        } else {
          if (state[todo.id].position >= newTodoInfo.position) {
            state[todo.id].position = state[todo.id].position + 1;
          }
        }
      console.log("state in transientSlice");
      Object.values(state).forEach((todo) => console.log(`${todo.id}: ${todo.position}`));
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
  toggleTransientColorNegative,
  addTransientAndReorder,
} = transientSlice.actions;
export default transientSlice.reducer;
