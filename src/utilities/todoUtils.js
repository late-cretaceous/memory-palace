export const generateChild = (parent, siblings, index = 0) => {
  return {
    id: Date.now().toString(),
    lineage: parent.lineage.concat(newNumber(siblings)),
    index: index,
    parent: parent.id,
    message: "",
    list: [],
    date: { month: "", day: "", year: "" },
  };
};

export const includeChild = (parent, id, storage) => {
  const newList = [...parent.list];
  newList.splice(storage[id].index, 0, id);

  return reorderedState({ ...parent, list: newList }, storage);
};

export const forgetChild = (parent, id, storage) => {
  const newParent = {
    ...parent,
    list: parent.list.filter((item) => item !== id),
  };

  return reorderedState(newParent, storage);
};

export const newNumber = (siblings) => {
  if (!siblings.length) return 0;

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
};

export const reIndex = (children) => {
  return children.reduce((acc, child, index) => {
    acc[child.id] = { ...child, index };
    return acc;
  }, {});
};

export const moveItem = (list, fromIndex, toIndex) => {
  const newList = [...list];
  const [draggedTodo] = newList.splice(fromIndex, 1);

  newList.splice(toIndex, 0, draggedTodo);

  return newList;
};

export const moveAndReIndex = (list, fromIndex, toIndex) => {
  return reIndex(moveItem(list, fromIndex, toIndex));
};

const reorderedState = (newListParent, storage) => {
  return {
    [newListParent.id]: newListParent,
    ...reIndex(Array.from(newListParent.list, (id) => storage[id])),
  };
};

const incompleteDate = (date) => {
  return !Boolean(date.month && date.day && date.year);
};

export const sortTodosByDate = (todos) => {
  const newTodos = [...todos];
  newTodos.sort((a, b) => {
    if (incompleteDate(a.date) && !incompleteDate(b.date)) return -1;
    if (incompleteDate(b.date)) return 1;

    const aDate = new Date(a.date.year, a.date.month - 1, a.date.day);
    const bDate = new Date(b.date.year, b.date.month - 1, b.date.day);
    return aDate - bDate;
  });
  return newTodos;
};
