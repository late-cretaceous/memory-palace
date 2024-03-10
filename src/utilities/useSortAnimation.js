import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { editTransientTodo } from "../redux/transientSlice";
import { toggleColorNegative } from "../redux/globalSlice";
import { toggleTransientColorNegative } from "../redux/transientSlice";
import { sortTodosByDate } from "./todoUtils";

const useSortAnimation = (
  cascade,
  setCascade,
  todos,
  sort,
  introStepOn = true,
  outroStepOn = true
) => {
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
  }

  useEffect(() => {
    if (cascade.phase !== "initialize") return;

    dispatch(toggleColorNegative({ area: "headerColorNegative" }));

    setCascade((prev) => {
      return { ...prev, phase: "frameskip" };
    });
  }, [cascade.phase, dispatch]);

  if (cascade.phase === "frameskip") {
    const sortedList = sort === "date" ? sortTodosByDate(todos) : todos;

    setCascade((prev) => {
      return {
        ...prev,
        phase: "cascade",
        sortedList: sortedList,
      };
    });

    sortedList.forEach((todo) => {
      dispatch(
        editTransientTodo({
          id: todo.id,
          edit: { inCascade: true, position: sortedList.indexOf(todo) },
        })
      );
    });
  }

  useEffect(() => {
    if (cascade.phase !== "cascade") return;

    if (isInBounds(cascade.index, todos.length)) {
      dispatch(
        toggleTransientColorNegative({
          id: cascade.sortedList[cascade.index].id,
        })
      );

      dispatch(
        editTransientTodo({
          id: cascade.sortedList[cascade.index].id,
          edit: { sortedAs: sort },
        })
      );
    }

    if (cascade.index >= todos.length) {
      dispatch(toggleColorNegative({ area: "backgroundColorNegative" }));
    }

    const timeoutId = setTimeout(() => {
      const increment = isOutroStep(outroStepOn, cascade, todos.length) ? 0 : 1;

      setCascade((prev) => {
        return {
          ...prev,
          index: cascade.index + increment,
          outroStep: isOutroStep(cascade, todos.length),
          switchColor: false,
        };
      });
    }, 75);

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

const isInBounds = (index, length) => {
  return index >= 0 && index < length;
};

export default useSortAnimation;
