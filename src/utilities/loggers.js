export const logChildrenInOrder = (parent) => {
  console.table(Object.values(parent).sort((a, b) => a.index - b.index));
};
