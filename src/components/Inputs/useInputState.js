import { useState } from "react";
import { useSelector } from "react-redux";

const useInputState = (todo, props, inputRef, inputName) => {
  const [selfHover, setSelfHover] = useState(false);
  const [selfFocus, setSelfFocus] = useState(false);
  const [confirmKeyPressed, setConfirmKeyPressed] = useState(false);

  const date = useSelector(
    (state) =>
      state.persistentSlice[todo.id]?.date ?? {
        month: null,
        day: null,
        year: null,
      }
  );

  const { inCascade, sortedAs: parentSortedAs } = useSelector(
    (state) => state.transientSlice[todo.id]
  );
  const { sort } = useSelector((state) => state.globalSlice);

  const {hover: parentHover, sortedAs} = useSelector(
    (state) => state.transientSlice[todo.id]
  );


  const handleFocus = (e) => {
    setSelfFocus(true);
    props.onFocus();

    e.target.select();

    if (inputRef.current) {
      inputRef.current.select();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab" || e.key === "Enter") {
      e.preventDefault();
      e.target.blur();
      props.setAdvanceField(inputName);
      setConfirmKeyPressed(true);
    }
  };

  const isDateEmpty = isEmpty(date[inputName]);
  const dimmest = isDateEmpty && !selfHover && !props.focused && !selfFocus;
  const dim =
    !selfFocus &&
    ((props.focused && !selfHover) ||
      (isDateEmpty && selfHover) ||
      (parentHover && !selfHover));
  const bright = !selfFocus && !isDateEmpty && selfHover;
  const brighest = selfFocus;

  const backgroundColor = dimmest
    ? props.color.faded(0.25)
    : dim
    ? props.color.faded(2)
    : bright
    ? props.color.faded(4)
    : brighest
    ? props.color.faded(6)
    : props.color.faded(1);

  const invisible =
    !props.focused &&
    (isOldAndCascadingIntoDate(inCascade, props.old, sort) ||
      recentSortableChangeAndNotHoveredInManual(
        parentHover,
        props.old,
        parentSortedAs
      ));

  return {
    setSelfHover,
    setSelfFocus,
    confirmKeyPressed,
    setConfirmKeyPressed,
    date,
    handleFocus,
    handleKeyDown,
    backgroundColor,
    invisible,
    sortedAs
  };
};

const isEmpty = (field) => !Boolean(field);

const isOldAndCascadingIntoDate = (inCascade, old, sort) => {
  return inCascade && old && sort === "date";
};

const recentSortableChangeAndNotHoveredInManual = (hover, old, sortedAs) => {
  return !hover && !old && sortedAs === "manual";
};

export default useInputState;
