import { useSelector, useDispatch } from "react-redux";
import { editTransientTodo, setCascade } from "../redux/transientSlice";
import { sortTodosByDate } from "./todoUtils";
import { matchPositionsToIndices } from "./reduxUtils";

const useListDisplayUpdate = (parent, todos) => {
  const cascade = useSelector(
    (state) => state.transientSlice[parent.id].cascade
  );

  const transients = useSelector((state) => state.transientSlice);

  const { singleSort } = useSelector(
    (state) => state.transientSlice[parent.id]
  );

  const dispatch = useDispatch();

  if (todoQuantitiesDiffer(cascade.sortedList, todos)) {
    const newList = [...todos];
    newList.sort(
      (a, b) => transients[a.id].position - transients[b.id].position
    );

    dispatch(
      setCascade({
        id: parent.id,
        cascade: { ...cascade, sortedList: newList },
      })
    );
  }

  if (singleSort.stage === "new") {
    const todo = todos.find((todo) => todo.id === singleSort.id);
    let nextSingleSortInfo = { id: null, stage: null };

    if (differentPlaceAfterSort(todo, cascade.sortedList, transients)) {
      dispatch(editTransientTodo({ id: singleSort.id, edit: { hide: true } }));
      nextSingleSortInfo = { ...singleSort, stage: "switching" };
    }

    dispatch(
      editTransientTodo({
        id: parent.id,
        edit: { singleSort: { ...nextSingleSortInfo } },
      })
    );
  }

  if (singleSort.stage === "adding") {
    const sortedTodos = sortTodosByDate(todos);
    matchPositionsToIndices(dispatch, sortedTodos);

    dispatch(
      setCascade({
        id: parent.id,
        cascade: { ...cascade, sortedList: sortedTodos },
      })
    );

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

const differentPlaceAfterSort = (todo, todos, unsorted) => {
  const sortedTodos = sortTodosByDate(todos);

  return sortedTodos.indexOf(todo) !== unsorted[todo.id].position;
};

export default useListDisplayUpdate;
