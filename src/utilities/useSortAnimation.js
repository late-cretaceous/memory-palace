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

  const listOpenTable = useSelector((state) => {
    const { bigTodo, ...transientsSansBigTodo } = state.transientSlice;

    return Object.keys(transientsSansBigTodo).reduce((acc, key) => {
      acc[key] = state.transientSlice[key].listOpen;
      return acc;
    }, {});
  });

  const isAnyListOpen = Object.values(listOpenTable).some((isOpen) => isOpen);

  if (cascade.sort !== sort && parent.id === "bigTodo") {
    const initialList = cascade.sort === "manual" ? todos : cascade.sortedList;

    dispatch(
      setCascade({
        id: parent.id,
        cascade: {
          ...cascade,
          introStep: introStepOn ? -1 : 0,
          sort: sort,
          phase: isAnyListOpen ? "initializing" : "initialized",
          on: true,
          unsortedList: initialList,
          sortedList: initialList,
        },
      })
    );
  }

  if (cascade.phase === "initializing") {
    closeAllLists(listOpenTable, dispatch);

    dispatch(
      setCascade({
        id: parent.id,
        cascade: { ...cascade, phase: "awaitingListClose" },
      })
    );
  }

  useEffect(() => {
    if (cascade.phase !== "initialized") return;
    //slight timeout prevents flicker for some reason
    setTimeout(() => {
      dispatch(toggleColorNegative({ area: "headerColorNegative" }));
      const sortedList = sort === "date" ? sortTodosByDate(todos) : todos;
      matchPositionsToIndices(dispatch, sortedList);

      dispatch(
        setCascade({
          id: parent.id,
          cascade: { ...cascade, phase: "frameskip", sortedList: sortedList },
        })
      );
    }, 1000);
  }, [cascade.phase, dispatch]);

  if (cascade.phase === "frameskip") {

    dispatch(
      setCascade({
        id: parent.id,
        cascade: { ...cascade, phase: "cascade" },
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

const closeAllLists = (listOpenTable, dispatch) => {
  Object.keys(listOpenTable).forEach((key) => {
    dispatch(
      editTransientTodo({
        id: key,
        edit: { listOpen: false },
      })
    );
  });
};

export default useSortAnimation;
