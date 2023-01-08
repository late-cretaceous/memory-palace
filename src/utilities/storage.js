const storage = {
  getAll: () => {
    const todoList = Object.values({ ...localStorage }).map((todo) =>
      JSON.parse(todo)
    );

    return todoList.sort((a, b) => a.index - b.index);
  },

  set: (todo) => {
    localStorage.setItem(todo.id, JSON.stringify(todo));
  },

  updateAll: (todos) => {
    localStorage.clear();
    todos.forEach((todo) => storage.set(todo));
  },
};

export default storage;