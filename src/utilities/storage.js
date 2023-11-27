const TodoKit = class {
  constructor(todo) {
    this.id = todo.id;
    this.lineage = todo.lineage;
    this.label = todo.label;
    this.index = todo.index;
    this.message = todo.message;
    this.parent = todo.parent;
    this.list = todo.list;
  }

  isParent() {
    return Boolean(this.list.length);
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
    });
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
    const [draggedTodo] = this.list.splice(fromIndex, 1);
    this.list.splice(toIndex, 0, draggedTodo);
    this.reIndex(database);
  }

  reIndex(database) {
    const list = this.list.map(id => database[id]);
    list.forEach((todo, index) => (todo.index = index));
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
};

export default TodoKit;
