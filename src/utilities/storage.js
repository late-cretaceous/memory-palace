export const Todos = class {
  constructor() {
    this.list = this.retrieveAll();
  }

  retrieveAll() {
    const todoList = Object.values({ ...localStorage }).map((todo) =>
      JSON.parse(todo)
    );

    return todoList.sort((a, b) => a.index - b.index);
  }

  reIndex() {
    this.list.forEach((todo, index) => (todo.index = index));
  }

  store(todo) {
    localStorage.setItem(todo.id, JSON.stringify(todo));
  }

  remove(id) {
    const index = this.list.findIndex((todo) => todo.id === id);

    const removee = this.list[index];

    this.list = this.list.filter((todo) => todo.id !== removee.id);
  }

  reorderStorage() {
    const retrieved = storage.retrieveAll();

    retrieved.forEach((todo) => {
      const newTodoIndex = this.list.findIndex(
        (newTodo) => todo.id === newTodo.id
      );
      todo.index = this.list[newTodoIndex].index;
      this.store(todo);
    });
  }
};

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
      const newTodoIndex = newTodos.findIndex(
        (newTodo) => todo.id === newTodo.id
      );
      todo.index = newTodos[newTodoIndex].index;
      storage.set(todo);
    });
  },
};

export default storage;
