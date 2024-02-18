import { useDispatch } from "react-redux";
import { editTransientTodos } from "../redux/transientSlice";

const useSortedListStaticChanges = (cascade, setCascade, todos) => {
  const dispatch = useDispatch();
  const change = addedOrRemovedId(
    returnTodoIds(cascade.sortedList),
    returnTodoIds(todos)
  );

  if (change) {
    const newList = [...cascade.sortedList];

    if (change.added) {
      const addedTodo = todos.find((todo) => todo.id === change.element);
      newList.splice(addedTodo.index, 0, addedTodo);
    } else {
      const removedTodo = cascade.sortedList.find(
        (todo) => todo.id === change.element
      );
      newList.splice(removedTodo.index, 1);
    }

    const repositionedTodos = Object.values(newList).map((todo) => ({
      id: todo.id,
      edit: { position: todo.index },
    }));

    //dispatch(editTransientTodos(repositionedTodos));

    setCascade({ ...cascade, sortedList: newList });
  }
};

const returnTodoIds = (todos) => {
  return todos.map((todo) => todo.id);
};

const additionalElement = (a, b) => {
  return a.filter((element) => !b.includes(element));
};

const addedOrRemovedId = (before, after) => {
  const [removed] = additionalElement(before, after);
  const [added] = additionalElement(after, before);

  if (!removed && !added) return null;

  const change = {
    added: added ? true : false,
    element: added ? added : removed,
  };

  return change;
};

export default useSortedListStaticChanges;
