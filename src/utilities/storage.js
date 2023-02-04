const TodoKit = class {
  constructor(todo) {
    this.id = todo.id;
    this.label = todo.label;
    this.index = todo.index;
    this.message = todo.message;
    this.parent = todo.parent;
    this.list = todo.list;
  }

  add(todo) {
    this.list.push(todo);
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

    this.list.sort((a, b) => a.index - b.index);
  }

  move(fromIndex, toIndex) {
    const [draggedTodo] = this.list.splice(fromIndex, 1);
    this.list.splice(toIndex, 0, draggedTodo);
    this.reIndex();
  }

  reIndex() {
    this.list.forEach((todo, index) => (todo.index = index));
  }

  store() {
    const todoFlat = new TodoKit({
      ...this,
      list: Array.from(this.list, (item) => item.id),
    });

    localStorage.setItem(todoFlat.id, JSON.stringify(todoFlat));    
  }

  remove(id) {
    const index = this.list.findIndex((todo) => todo.id === id);

    const removee = this.list[index];

    this.list = this.list.filter((todo) => todo.id !== removee.id);
  }

  reorderStorage() {
    this.list.forEach(todo => todo.store());
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
