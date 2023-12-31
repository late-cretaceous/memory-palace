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

    cascade.sortedList.forEach((todo) => {
      dispatch(
        editTransientTodo({
          id: todo.id,
          edit: { inCascade: true },
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
    else if (cascade.index >= todos.length) {
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

    const timeoutId = setTimeout(() => {
      setCascade((prev) => {
        return { ...prev, index: prev.index + 1 };
      });
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [cascade.phase, cascade.index, todos.length, dispatch, todos]);

  return cascade;
};

export default useSortAnimation;
