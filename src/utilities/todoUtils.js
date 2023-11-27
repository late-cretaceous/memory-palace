export const generateChild = (todo, siblings, index = 0) => {
  return {
    id: Date.now().toString(),
    lineage: todo.lineage.concat(newNumber(todo, siblings)),
    index: index,
    parent: todo.id,
    message: "",
    list: [],
  };
};

export const isParent = (todo) => {
    return Boolean(this.list.length);
  }

export const includeChild = (todo, id, database) => {
    const newList = [...todo.list];
    newList.splice(database[id].index, 0, id);
    return { ...todo, list: newList };
  }

  export const listHierarchy = (todo, database) => {
    if (!todo.list.length) {
      return [];
    }
  
    const descendants = [];
  
    for (const id of todo.list) {
      descendants.push(database[id]);
      descendants.push(...listHierarchy(database[id], database));
    }
  
    return descendants;
  }
  
  export const moveChild = (todo, fromIndex, toIndex, database) => {
    const newList = [...todo.list];
    const [draggedTodo] = newList.splice(fromIndex, 1);
    newList.splice(toIndex, 0, draggedTodo);
    return { ...todo, list: newList };
  }

  //If moveTodo is f'ed it's because reIndex dropped off. It's used in remove as well
  
  export const forgetChild = (todo, id, database) => {
    return { ...todo, list: todo.list.filter(item => item !== id) };
  }
  
  export const newNumber = (todo, siblings) => {
    if (!todo.list.length) return 0;
  
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