import { createSlice } from "@reduxjs/toolkit";

const createTransientTodo = (initialValues) => {
  const defaultValues = {
    id: initialValues.id,
    listOpen: false,
    hover: false,
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
      console.log("Remove transient todo:");
      console.dir(action);

      /*
                const id = action.payload.id;

                action.descendants.forEach((descendant) =>
                    delete state[descendant]
                )

                delete state[id]
                */
      return { ...state };
    },
  },
});

export { createTransientTodo };
export const { addTransientTodo, removeTransientTodo } = transientSlice.actions;
export default transientSlice.reducer;
