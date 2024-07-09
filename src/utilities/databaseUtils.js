import { createTodo } from "./todoUtils";

export const addToStorage = (todo) => {
  localStorage.setItem(todo.id, JSON.stringify(todo));
};

export const mergeToStateAndStore = (state, todosObject) => {
  Object.assign(state, todosObject);
  for (const todo of Object.values(todosObject)) {
    addToStorage(todo);
  }
};

export const removeFromStorage = (id) => {
  localStorage.removeItem(id);
};

export const fetchTodo = (id) => {
  const parsedTodo = JSON.parse(localStorage.getItem(id));

  return parsedTodo ? createTodo(parsedTodo) : null;
};

export const listHierarchy = (id) => {
  const todo = fetchTodo(id);

  if (!todo.list.length) {
    return [];
  }

  const descendants = [];

  for (const id of todo.list) {
    descendants.push(id);
    descendants.push(...listHierarchy(id));
  }

  return descendants;
};
