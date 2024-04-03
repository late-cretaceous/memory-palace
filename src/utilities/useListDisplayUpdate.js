import { useSelector, useDispatch } from "react-redux";
import { editTransientTodo } from "../redux/transientSlice";
import { propertyById } from "./reduxUtils";
import { sortTodosByDate } from "./todoUtils";
import { matchPositionsToIndices } from "./reduxUtils";

const useListDisplayUpdate = (cascade, setCascade, todos, parent) => {
  const positions = useSelector((state) =>
    propertyById(state, todos, "position")
  );

  const { singleSort } = useSelector(
    (state) => state.transientSlice[parent.id]
  );
  const dispatch = useDispatch();

  if (todoQuantitiesDiffer(cascade.sortedList, todos)) {
    const newList = [...todos];
    newList.sort((a, b) => positions[a.id] - positions[b.id]);

    setCascade({ ...cascade, sortedList: newList });
  }

  if (singleSort.stage === "new") {
    dispatch(editTransientTodo({ id: singleSort.id, edit: { hide: true } }));

    dispatch(
      editTransientTodo({
        id: parent.id,
        edit: { singleSort: { ...singleSort, stage: "switching" } },
      })
    );
  }

  if (singleSort.stage === "adding") {
    console.log("adding");
    const todo = todos.find((todo) => todo.id === singleSort.id);

    if (differentPlaceAfterSort(todo, cascade.sortedList, positions)) {
      const sortedTodos = sortTodosByDate(todos);
      matchPositionsToIndices(dispatch, sortedTodos);

      setCascade((prev) => {
        return { ...prev, sortedList: sortedTodos };
      });
    }

    dispatch(editTransientTodo({ id: singleSort.id, edit: { hide: false } }));

    dispatch(
      editTransientTodo({
        id: parent.id,
        edit: { singleSort: { id: null, stage: null } },
      })
    );
  }
};

const todoQuantitiesDiffer = (lista, listb) => lista.length !== listb.length;

const differentPlaceAfterSort = (todo, todos, unsortedPositions) => {
  const sortedTodos = sortTodosByDate(todos);

  return sortedTodos.indexOf(todo) !== unsortedPositions[todo.id];
};

export default useListDisplayUpdate;
