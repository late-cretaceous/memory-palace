import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { editTransientTodo } from "../redux/transientSlice";

const useSortAnimation = (todos, sort) => {
  const [cascade, setCascade] = useState({
    index: 0,
    phase: "off",
    on: false,
    sort: sort,
    unsortedList: todos,
    sortedList: todos,
  });

  const dispatch = useDispatch();

  if (cascade.sort !== sort) {
    setCascade((prev) => {
      return {
        ...prev,
        sort: sort,
        phase: "initialize",
        on: true,
        unsortedList: cascade.sortedList,
      };
    });

    const newlySortedList = sortedTransientTodos(todos, sort);

    cascade.sortedList.forEach((todo) => {
      dispatch(
        editTransientTodo({
          id: todo.id,
          edit: { inCascade: true, position: newlySortedList.indexOf(todo) },
        })
      );
    });
  }

  useEffect(() => {
    if (cascade.phase !== "initialize") return;

    setCascade((prev) => {
      return { ...prev, phase: "frameskip" };
    });
  }, [cascade.phase]);

  if (cascade.phase === "frameskip") {
    const sortedList =
      sort === "date"
        ? Array.from(todos).sort((a, b) => a.message.length - b.message.length)
        : todos;

    setCascade((prev) => {
      return {
        ...prev,
        phase: "cascade",
        sortedList: sortedList,
      };
    });
  }

  useEffect(() => {
    if (cascade.phase !== "cascade") return;

    const timeoutId = setTimeout(() => {
      setCascade((prev) => {
        return { ...prev, index: prev.index + 1 };
      });
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [cascade.phase, cascade.index]);

  if (cascade.index > todos.length) {
    setCascade((prev) => {
      return { ...prev, phase: "off", on: false, index: 0 };
    });

    todos.forEach((todo) => {
      dispatch(
        editTransientTodo({
          id: todo.id,
          edit: { inCascade: false },
        })
      );
    });
  }

  return cascade;
};

const sortedTransientTodos = (todos, sort) => {
  const newlySortedList =
  sort === "manual"
    ? todos
    : Array.from(todos).sort((a, b) => a.message.length - b.message.length);

  return newlySortedList;
}

export default useSortAnimation;
