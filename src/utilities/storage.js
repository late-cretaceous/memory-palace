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
  }

  static pull(id) {
    const object = JSON.parse(localStorage.getItem(id));

    //scaffold to logged pulled todos so you can find what's going on with the crashes
    console.log(`Pulled object ID: ${id}`);
    console.dir(object);
    if (!object) return;

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
    return this.list.findIndex((item) => item === id);
  }

  add(id, database) {
    this.list.splice(database[id].index, 0, id);
    this.list = [...this.list];
    this.reIndex(database);
  }

  generateChild(index = 0, siblings) {
    return new TodoKit({
      id: Date.now().toString(),
      lineage: this.lineage.concat(this.newNumber(siblings)),
      index: index,
      parent: this.id,
      message: "",
      list: [],
      listLoaded: true,
    });
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

  listHierarchy(database) {
    if (!this.list.length) {
      return [];
    }

    const descendants = [];

    for (const id of this.list) {
      descendants.push(database[id]);
      descendants.push(...database[id].listHierarchy(database));
    }

    return descendants;
  }

  move(fromIndex, toIndex, database) {
    const list = this.list.map(id => database[id]);
    const [draggedTodo] = list.splice(fromIndex, 1);
    list.splice(toIndex, 0, draggedTodo);
    this.reIndex(database);
  }

  reIndex(database) {
    const list = this.list.map(id => database[id]);
    list.forEach((todo, index) => (todo.index = index));
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

  remove(id, database) {
    this.list = this.list.filter(item => item !== id);
    this.reIndex(database);
  }

  empties() {
    return this.list.filter(
      (child) => !child.message.length && !child.list.length
    );
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

  newNumber(siblings) {
    if (!this.list.length) return 0;

    const todoNumbers = Array.from(
      siblings,
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
