const TodoKit = class {
  constructor(todo) {
    this.id = todo.id;
    this.label = todo.label;
    this.index = todo.index;
    this.message = todo.message;
    this.parent = todo.parent;
    this.list = todo.list;
    this.listLoaded = todo.listLoaded;

    if (TodoKit.isTodo(this.parent) && this.parent.hasTodo(this)) {
      this.linkToParent();
    }
  }

  static pull(id) {
    const object = JSON.parse(localStorage.getItem(id));
    return new TodoKit(object);
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
      const newTodo = TodoKit.pull(id);
      this.list.push(newTodo);
    }

    this.list.sort((a, b) => a.index - b.index);
    this.listLoaded = true;
  }

  pullDescendants() {
    this.pullChildren();

    for (const child of this.list) {
      child.pullDescendants();
    }
  }

  listDescendants() {
    if (!this.list.length) {
      return [];
    }

    const descendants = [];

    const children = this.listLoaded
      ? this.list
      : this.list.map((id) => TodoKit.pull(id));
    
    children.forEach((child) => {
      descendants.push(...child.listDescendants());
    });

    return children.concat(descendants);
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
      listLoaded: false,
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
