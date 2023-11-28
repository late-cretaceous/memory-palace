export const generateChild = (parent, siblings, index = 0) => {
  return {
    id: Date.now().toString(),
    lineage: parent.lineage.concat(newNumber(parent, siblings)),
    index: index,
    parent: parent.id,
    message: "",
    list: [],
  };
};

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
  
  export const moveChild = (parent, fromIndex, toIndex) => {
    const newList = [...parent.list];
    const [draggedTodo] = newList.splice(fromIndex, 1);
    newList.splice(toIndex, 0, draggedTodo);
    return { ...parent, list: newList };
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