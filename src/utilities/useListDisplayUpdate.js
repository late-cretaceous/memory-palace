import { useSelector, useDispatch } from "react-redux";
import { editTransientTodo } from "../redux/transientSlice";
import { propertyById } from "./reduxUtils";
import { sortTodosByDate } from "./todoUtils";

const useListDisplayUpdate = (cascade, setCascade, todos) => {
  const positions = useSelector((state) =>
    propertyById(state, todos, "position")
  );
  const parentId = todos[0].parent;
  const { newChildSort } = useSelector(
    (state) => state.transientSlice[parentId]
  );
  const dispatch = useDispatch();

  if (todoQuantitiesDiffer(cascade.sortedList, todos)) {
    const newList = [...todos];
    newList.sort((a, b) => positions[a.id] - positions[b.id]);

    setCascade({ ...cascade, sortedList: newList });
  }

  if (newChildSort.stage === "new") {
    dispatch(editTransientTodo({ id: newChildSort.id, edit: { hide: true } }));

    dispatch(
      editTransientTodo({
        id: parentId,
        edit: { newChildSort: { ...newChildSort, stage: "switching" } },
      })
    );
  }

  if (newChildSort.stage === "adding") {
    console.log("adding");
    const todo = todos.find((todo) => todo.id === newChildSort.id);

    console.log(differentPlaceAfterSort(todo, cascade.sortedList, positions));

    dispatch(editTransientTodo({ id: newChildSort.id, edit: { hide: false } }));

    dispatch(
      editTransientTodo({
        id: parentId,
        edit: { newChildSort: { id: null, stage: null } },
      })
    );
  }
};

const todoQuantitiesDiffer = (lista, listb) => lista.length !== listb.length;

const differentPlaceAfterSort = (todo, todos, unsortedPositions) => {
  const sortedTodos = sortTodosByDate(todos);
  console.table(sortedTodos);
  console.table(unsortedPositions);

  console.log(todo.id);
  console.log(sortedTodos.indexOf(todo));
  console.log(unsortedPositions[todo.id]);

  return sortedTodos.indexOf(todo) !== unsortedPositions[todo.id];
}

export default useListDisplayUpdate;
