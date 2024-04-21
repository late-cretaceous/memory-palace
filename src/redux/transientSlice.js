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
    sortedAs: "manual",
    hasSortableChange: false,
    singleSort: { id: null, stage: null },
    hide: false,
    cascade: {
      index: -1,
      phase: "off",
      on: false,
      sort: "manual",
      unsortedList: [],
      sortedList: [],
      outroStep: false,
      switchColor: false,
    },
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
      console.log("trimming");
      const transientSliceKeys = Object.keys(state);
      const localStorageKeys = loadTodoKeys();

      const transientSliceKeysToRemove = transientSliceKeys.filter(
        (key) => !localStorageKeys.includes(key)
      );

      transientSliceKeysToRemove.forEach((key) => delete state[key]);
    },
    addOrRemoveTransientAndReorder: (
      state,
      { payload: { parent, todos, info } }
    ) => {
      if (info.type === "add") {
        Object.values(todos).forEach((todo) => {
          if (todo.id === info.id) {
            state[todo.id] = createTransientTodo({
              id: info.id,
              position: info.position,
              colorNegative: info.sortedAs !== "manual",
              hasSortableChange: true,
              sortedAs: info.sortedAs,
            });
          } else {
            if (state[todo.id].position >= info.position) {
              state[todo.id].position = state[todo.id].position + 1;
            }
          }
        });
      }
      if (info.type === "remove") {
        const family = { ...todos, [parent.id]: parent };
        Object.values(family).forEach((todo) => {
          if (state[todo.id].position > info.position) {
            state[todo.id].position = state[todo.id].position - 1;
          }
        });
      } else if (info.type === "move") {
        Object.values(todos).forEach((todo) => {
          state[todo.id].position = todo.index;
        });
      }
    },
    setCascade: (state, { payload: { id, cascade } }) => {
      state[id].cascade = cascade;
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
  addOrRemoveTransientAndReorder,
  setCascade,
} = transientSlice.actions;
export default transientSlice.reducer;
