const TodoKit = class {
  constructor(todo) {
    this.id = todo.id;
    this.label = todo.label;
    this.index = todo.index;
    this.message = todo.message;
    this.parent = todo.parent;
    this.list = todo.list;
  }

  retrieveAll() {
    if (!localStorage.length) return;

    const todoList = JSON.parse(localStorage.getItem("bigTodo")).list;

    this.list = todoList.sort((a, b) => a.index - b.index);
  }

  add(todo) {
    const newTodo = new TodoKit(todo);

    this.list.push(newTodo);
  }

  pull(id) {
    return JSON.parse(localStorage.getItem(id));
  }

  pullDescendents() {
    if (!this.list.length) return
    
    const ids = [...this.list];
    
    this.list = [];

    for (const id of ids) {
      const newTodo = new TodoKit(this.pull(id));
      newTodo.pullDescendents();
      this.list.push(newTodo);
    }
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
    const todoFlat = new TodoKit({
      ...todo,
      list: Array.from(todo.list, (item) => item.id),
    });

    localStorage.setItem(todoFlat.id, JSON.stringify(todoFlat));    
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

  newNumber() {
    if (this.list.length) {
      let sortedTodoLabels = Array.from(
        this.list,
        (todo) => todo.label
      ).sort();

      for (let i = 0; i < sortedTodoLabels.length; i++) {
        if (!sortedTodoLabels[i + 1]) {
          return sortedTodoLabels[i] + 1;
        } else if (sortedTodoLabels[i] < sortedTodoLabels[i + 1] - 1) {
          return i + 1;
        }
      }
    }
    return 0;
  }
};

export default TodoKit;
