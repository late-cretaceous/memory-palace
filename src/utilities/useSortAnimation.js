import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { editTransientTodo } from "../redux/transientSlice";
import { toggleColorNegative } from "../redux/globalSlice";
import { toggleTransientColorNegative } from "../redux/transientSlice";

const useSortAnimation = (
  todos,
  sort,
  introStepOn = true,
  outroStepOn = true
) => {
  const [cascade, setCascade] = useState({
    index: introStepOn ? -1 : 0,
    phase: "off",
    on: false,
    sort: sort,
    unsortedList: todos,
    sortedList: todos,
    outroStep: false,
    switchColor: false,
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

    dispatch(toggleColorNegative({ area: "headerColorNegative" }));

    setCascade((prev) => {
      return { ...prev, phase: "frameskip" };
    });
  }, [cascade.phase, dispatch]);

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

    console.log(`index: ${cascade.index}, switchColor: ${cascade.switchColor}`);
    if (
      !cascade.switchColor
    ) {
      setCascade((prev) => {
        return {
          ...prev,
          switchColor: true,
        };
      });
    } else if (cascade.index >= todos.length) {
      dispatch(toggleColorNegative({ area: "backgroundColorNegative" }));
    }

    if (cascade.switchColor && cascade.index > 0) {
      console.log("toggleTransientColorNegative");
      dispatch(
        toggleTransientColorNegative({
          id: cascade.sortedList[cascade.index - 1].id,
        })
      );
    }

    const timeoutId = setTimeout(() => {
      console.log("--1000 ms--");
      const increment =
        isOutroStep(outroStepOn, cascade, todos.length)
          ? 0
          : 1;

      setCascade((prev) => {
        return {
          ...prev,
          index: cascade.index + increment,
          outroStep: isOutroStep(cascade, todos.length),
          switchColor: false,
        };
      });
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [cascade, todos.length, outroStepOn, dispatch]);

  if (cascade.index > todos.length) {
    setCascade((prev) => {
      return {
        ...prev,
        phase: "off",
        on: false,
        index: introStepOn ? -1 : 0,
        outroStep: false,
      };
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

const isOutroStep = (outroStepOn, cascade, length) => {
  return outroStepOn && !cascade.outroStep && cascade.index === length;
};

const sortedTransientTodos = (todos, sort) => {
  const newlySortedList =
    sort === "manual"
      ? todos
      : Array.from(todos).sort((a, b) => a.message.length - b.message.length);

  return newlySortedList;
};

export default useSortAnimation;
