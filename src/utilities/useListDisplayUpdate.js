import { useSelector } from "react-redux";

const useListDisplayUpdate = (cascade, setCascade, todos) => {
  const positions = useSelector((state) =>
    todos.reduce((acc, todo) => {
      acc[todo.id] = state.transientSlice[todo.id].position;
      return acc;
    }, {})
  );

  if (todos.length !== cascade.sortedList.length) {
    const newList = [...todos];
    newList.sort((a, b) => positions[a.id] - positions[b.id]);

    setCascade({ ...cascade, sortedList: newList });
  }
};

export default useListDisplayUpdate;
