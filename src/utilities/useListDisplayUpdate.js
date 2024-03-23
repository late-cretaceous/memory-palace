import { useSelector, useDispatch } from "react-redux";
import { editTransientTodo } from "../redux/transientSlice";

const useListDisplayUpdate = (cascade, setCascade, todos) => {
  const positions = useSelector((state) => transientPositions(state, todos));
  const parentId = todos[0].parent;
  const hasNewMousedOutChild = useSelector((state) => state.transientSlice[parentId].hasNewChild);
  const dispatch = useDispatch();


  if (todoQuantitiesDiffer(cascade.sortedList, todos)) {
    const newList = [...todos];
    newList.sort((a, b) => positions[a.id] - positions[b.id]);

    setCascade({ ...cascade, sortedList: newList });
  }

  if (hasNewMousedOutChild) {
    dispatch(editTransientTodo({
      id: parentId,
      edit: { hasNewChild: false },
    }));
  }
};

const transientPositions = (state, todos) => {
  return todos.reduce((acc, todo) => {
    acc[todo.id] = state.transientSlice[todo.id].position;
    return acc;
  }, {});
};

const todoQuantitiesDiffer = (lista, listb) =>
  lista.length !== listb.length;

export default useListDisplayUpdate;
