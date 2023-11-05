import { createSlice } from "@reduxjs/toolkit";
import { loadTodos } from "../utilities/reduxStorage";
import TodoKit from "../utilities/storage";

const persistentSlice = createSlice({
  name: "persistentTodos",
  initialState: {},
  reducers: {
    addTodo: (state, action) => {
      const todo = action.payload;
      state[todo.id] = todo;
      if (todo.parent) {
        todo.parent.add(todo);
      }
    },
    removeTodo: (state, action) => {
      const id = action.payload;
      const removee = state[id];
      const descendants = removee.listHierarchy();
      descendants.forEach((descendant) => {
        delete state[descendant.id];
      });

      const parent = state[removee.parent.id];
      parent.remove(id);

      delete state[id];
    },
    moveTodo: (state, action) => {
      const e = action.payload;

      if (!e.destination) return;

      const parent = state[e.draggableId].parent;
      parent.move(e.source.index, e.destination.index);

      return { ...state };
    },
    editTodo: (state, action) => {
      const { id, edit } = action.payload;

      state[id] = new TodoKit({ ...state[id], ...edit });
    },
  },
});

export const { addTodo, removeTodo, moveTodo, editTodo } =
  persistentSlice.actions;

export default persistentSlice.reducer;
