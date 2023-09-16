const TodoKit = class {
  constructor(todo) {
    this.id = todo.id;
    this.lineage = todo.lineage;
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

  isBigTodo() {
    return this.id === "bigTodo";
  }

  hasTodo(todo) {
    return Boolean(this.lookup(todo.id));
  }

  isParent() {
    return Boolean(this.list.length);
  }

  indexOf(id) {
    return this.list.findIndex((todo) => todo.id === id);
  }

  add(todo) {
    this.list.splice(todo.index, 0, todo);
    this.reIndex();
  }

  pullChildren() {
    if (this.listLoaded) return;

    const ids = [...this.list];

    this.list = [];

    for (const id of ids) {
      const newTodo = TodoKit.pull(id);
      newTodo.parent = this;
      this.list.push(newTodo);
    }

    this.list.sort((a, b) => a.index - b.index);

    this.listLoaded = true;
  }

  pullDescendants() {
    this.pullChildren();

    this.list.forEach((child) => child.pullDescendants());
  }

  //not used. hard-to-follow logic replaced by more hiearchal version below
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

  listHierarchy() {
    if (!this.list.length) {
      return []
    }

    const descendants = [];

    for (const child of this.list) {
      descendants.push(child);
      descendants.push(...child.listHierarchy());
    }

    return descendants
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

    removee.removeDescendantsFromStorage();

    this.list = this.list.filter((todo) => todo.id !== removee.id);
    this.reIndex();
  }

  clearEmpties() {
    this.list.forEach(child => {
      if (!child.message.length && !child.list.length) {
        this.remove(child.id);
      }
    })
  }

  removeDescendantsFromStorage() {
    this.listDescendants().forEach((descendant) =>
      localStorage.removeItem(descendant.id)
    );
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

    const todoNumbers = Array.from(
      this.list,
      (todo) => todo.lineage[todo.lineage.length - 1]
    ).sort();

    for (let i = 0; i < todoNumbers.length; i++) {
      if (todoNumbers[i] !== i) {
        return i;
      } else if (!todoNumbers[i + 1]) {
        return todoNumbers[i] + 1;
      }
    }
  }

  youngestDescendant() {
    if (!this.isParent()) {
      return this;
    }

    return this.list[0].youngestDescendant();
  }
};

export default TodoKit;
