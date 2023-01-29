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

  retrieve(id) {
    this.add(JSON.parse(localStorage.getItem(id)));
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
      let sortedTodoLabels = Array.from(parent.list, (todo) => todo.label).sort();

      for (let i = 0; i < sortedTodoLabels.length; i++) {
        if (!sortedTodoLabels[i + 1]) {
          scaffoldCount = i + 1;
          break;
        } else if (sortedTodoLabels[i] < sortedTodoLabels[i + 1] - 1) {
          scaffoldCount = i + 1;
          break;
        }
      }
    }
    return scaffoldCount;
  }
};

export default TodoKit;
