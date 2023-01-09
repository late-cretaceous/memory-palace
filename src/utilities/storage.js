const storage = {
  retrieveAll: () => {
    const todoList = Object.values({ ...localStorage }).map((todo) =>
      JSON.parse(todo)
    );

    return todoList.sort((a, b) => a.index - b.index);
  },

  set: (todo) => {
    localStorage.setItem(todo.id, JSON.stringify(todo));
  },

  updateOrder: (newTodos) => {
    const todos = storage.retrieveAll();
    
    todos.forEach((todo) => {
        const newTodoIndex = newTodos.findIndex((newTodo) => todo.id === newTodo.id);
        todo.index = newTodos[newTodoIndex].index;
        storage.set(todo);
    });
  },
};

export default storage;