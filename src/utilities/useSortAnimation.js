import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { editTransientTodo } from "../redux/transientSlice";

const sortedTransientTodos = (todos, sort) => {
  const newlySortedList =
    sort === "manual"
      ? todos
      : Array.from(todos).sort((a, b) => a.message.length - b.message.length);

  return newlySortedList;
};

const isDelayRound = (index, delay) => {
  if (delay && index === 0) return true;
  return false;
};

const useSortAnimation = (todos, sort, delay = true) => {
  const [cascade, setCascade] = useState({
    index: 0,
    phase: "off",
    on: false,
    sort: sort,
    unsortedList: todos,
    sortedList: todos,
    delay: delay,
  });

  const dispatch = useDispatch();

  if (cascade.sort !== sort) {
    const initialList = cascade.sort === "manual" ? todos : cascade.sortedList;

    setCascade((prev) => {
      return {
        ...prev,
        sort: sort,
        phase: "initialize",
        on: true,
        unsortedList: initialList,
        sortedList: initialList,
      };
    });

    const newlySortedList = sortedTransientTodos(todos, sort);

    newlySortedList.forEach((todo) => {
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
      const increment = cascade.delay ? 0 : 1;

      setCascade((prev) => {
        return { ...prev, index: cascade.index + increment, delay: false };
      });
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [cascade.phase, cascade.index, cascade.delay]);

  if (cascade.index > todos.length) {
    setCascade((prev) => {
      return { ...prev, phase: "off", on: false, index: 0, delay: delay };
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

export default useSortAnimation;
