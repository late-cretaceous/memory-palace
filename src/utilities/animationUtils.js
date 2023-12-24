export const mergeArraysAtIdx = (arr1, arr2, index) =>
  arr1.slice(0, index).concat(arr2.slice(index, arr2.length));

export const previousTodosFrom = (todos) => {
  return Array.from(todos, (todo) => {
    return { ...todo, placeholderKey: Math.floor(Math.random() * 10000) };
  });
};
