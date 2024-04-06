import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editTransientTodo, setCascade } from "../redux/transientSlice";
import { toggleColorNegative } from "../redux/globalSlice";
import { toggleTransientColorNegative } from "../redux/transientSlice";
import { sortTodosByDate } from "./todoUtils";
import { matchPositionsToIndices } from "./reduxUtils";


const useSortAnimation = (
  todos,
  parent,
  sort,
  introStepOn = true,
  outroStepOn = true
) => {
  const dispatch = useDispatch();
  const cascade = useSelector(
    (state) => state.transientSlice[parent.id].cascade
  );

  if (cascade.sort !== sort) {
    const initialList = cascade.sort === "manual" ? todos : cascade.sortedList;

    dispatch(
      setCascade({
        id: parent.id,
        cascade: {
          ...cascade,
          introStep: introStepOn ? -1 : 0,
          sort: sort,
          phase: "initialize",
          on: true,
          unsortedList: initialList,
          sortedList: initialList,
        },
      })
    );
  }

  useEffect(() => {
    if (cascade.phase !== "initialize") return;

    dispatch(toggleColorNegative({ area: "headerColorNegative" }));

    dispatch(
      setCascade({
        id: parent.id,
        cascade: { ...cascade, phase: "frameskip" },
      })
    );

  }, [cascade.phase, dispatch]);

  if (cascade.phase === "frameskip") {
    const sortedList = sort === "date" ? sortTodosByDate(todos) : todos;
    matchPositionsToIndices(dispatch, sortedList);

    dispatch(
      setCascade({
        id: parent.id,
        cascade: { ...cascade, phase: "cascade", sortedList: sortedList },
      })
    );
  }

  useEffect(() => {
    if (cascade.phase !== "cascade") return;

    if (isInBounds(cascade.index, todos.length)) {
      dispatch(
        toggleTransientColorNegative({
          id: cascade.sortedList[cascade.index].id,
        })
      );

      //may not need anymore now that you have the cascade in the redux store
      dispatch(
        editTransientTodo({
          id: cascade.sortedList[cascade.index].id,
          edit: { sortedAs: sort },
        })
      );
    }

    if (cascade.outroStep) {
      console.log(`outroStep: ${cascade.outroStep}`);
      console.log("toggleColorNegative");
      dispatch(toggleColorNegative({ area: "backgroundColorNegative" }));
    }

    const timeoutId = setTimeout(() => {
      const increment = isOutroStep(outroStepOn, cascade, todos.length) ? 0 : 1;

      dispatch(
        setCascade({
          id: parent.id,
          cascade: {
            ...cascade,
            index: cascade.index + increment,
            outroStep: isOutroStep(outroStepOn, cascade, todos.length),
            switchColor: false,
          },
        })
      );
    }, 75);

    return () => clearTimeout(timeoutId);
  }, [cascade, todos.length, outroStepOn, dispatch]);

  if (cascade.index > todos.length) {

    dispatch(
      setCascade({
        id: parent.id,
        cascade: {
          ...cascade,
          phase: "off",
          on: false,
          index: introStepOn ? -1 : 0,
          outroStep: false,
        },
      })
    );

    //maybe store this in the redux store with the cascade object?
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
