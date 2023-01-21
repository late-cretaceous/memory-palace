const TodoKit = class {
  constructor(parent) {
    const id = !parent ? -1 : this.newNumber(parent).toString();

    this.id = id;
    this.index = !parent ? null : parent.list.length;
    this.message = '';
    this.list = [];
    this.parent = !parent ? null : parent.id;
  }

  retrieveAll() {
    const todoList = Object.values({ ...localStorage }).map((todo) =>
      JSON.parse(todo)
    );

    this.list = todoList.sort((a, b) => a.index - b.index);
  }

  add(parent) {
    const todo = new TodoKit(parent);

    this.list = this.list.concat([todo]);

    return todo;
  }

  move(fromIndex, toIndex) {
    const [draggedTodo] = this.list.splice(fromIndex, 1);
    draggedTodo.index = toIndex;
    this.list.splice(toIndex, 0, draggedTodo);
    this.reIndex();
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
    const retrieved = this.retrieveAll();

    retrieved.forEach((todo) => {
      const newTodoIndex = this.list.findIndex(
        (newTodo) => todo.id === newTodo.id
      );
      todo.index = this.list[newTodoIndex].index;
      this.store(todo);
    });
  }

  newNumber(parent) {
    let scaffoldCount = 0;
    if (parent.list.length) {
      let sortedTodoIds = Array.from(parent.list, (todo) => todo.id).sort();

      for (let i = 0; i < sortedTodoIds.length; i++) {
        if (!sortedTodoIds[i + 1]) {
          scaffoldCount = i + 1;
          break;
        } else if (sortedTodoIds[i] < sortedTodoIds[i + 1] - 1) {
          scaffoldCount = i + 1;
          break;
        }
      }
    }
    return scaffoldCount;
  };
};

export default TodoKit;