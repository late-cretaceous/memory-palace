export const addToStorage = (todo) => {
    localStorage.setItem(todo.id, JSON.stringify(todo));
  }

export const mergeToStateAndStore = (state, todosObject) => {
    Object.assign(state, todosObject);
    for (const todo of Object.values(todosObject)) {
      addToStorage(todo);
    }
} 

export const removeFromStorage = (id) => {
    localStorage.removeItem(id);
}

export const fetchTodo = (id) => {
    return JSON.parse(localStorage.getItem(id));
}