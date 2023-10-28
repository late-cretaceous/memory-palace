import { createSelector } from "@reduxjs/toolkit";

const makeSelectTodoList = (id) =>
  createSelector(
    [(state) => state.persistentSlice[id].list],
    (todoList) => todoList
  );

export default makeSelectTodoList;
