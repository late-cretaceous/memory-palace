const TodoKit = class {
  constructor(todo) {
    this.id = todo.id;
    this.label = todo.label;
    this.index = todo.index;
    this.message = todo.message;
    this.parent = todo.parent;
    this.list = todo.list;

    if (TodoKit.isTodo(this.parent) && this.parent.hasTodo(this)) {
      this.linkToParent();
    }
  }

  static pull(id) {
    return JSON.parse(localStorage.getItem(id));
  }

  static isTodo(todo) {
    return todo instanceof TodoKit;
  }

  hasTodo(todo) {
    return Boolean(this.lookup(todo.id));
  }

  indexOf(id) {
    return this.list.findIndex((todo) => todo.id === id);
  }

  add(todo) {
    this.list.push(todo);
  }

  pullChildren() {
    const ids = [...this.list];

    this.list = [];

    for (const id of ids) {
      const newTodo = new TodoKit(TodoKit.pull(id));
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
      parent: this.parent ? this.parent.id : null,
      list: Array.from(this.list, (item) => item.id),
    });

    localStorage.setItem(todoFlat.id, JSON.stringify(todoFlat));
  }

  lookup(id) {
    return this.list[this.indexOf(id)];
  }

  remove(id) {
    const removee = this.lookup(id);

    this.list = this.list.filter((todo) => todo.id !== removee.id);
  }

  reorderStorage() {
    this.list.forEach((todo) => todo.store());
  }

  linkToParent() {
    if (!(this.parent instanceof TodoKit)) return;

    const index = this.parent.indexOf(this.id);

    this.parent.list.splice(index, 1, this);
  }

  newNumber() {
    if (!this.list.length) return 0;
    const sortedLabels = Array.from(this.list, (todo) => todo.label).sort();

    for (let i = 0; i < sortedLabels.length; i++) {
      if (sortedLabels[i] !== i) {
        return i;
      } else if (!sortedLabels[i + 1]) {
        return sortedLabels[i] + 1;
      }
    }
  }
};

export default TodoKit;
