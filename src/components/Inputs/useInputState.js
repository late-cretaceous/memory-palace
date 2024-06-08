import { useState } from "react";
import { useSelector } from "react-redux";

const useInputState = (todo, props, inputRef, inputName) => {
  const [selfHover, setSelfHover] = useState(false);
  const [selfFocus, setSelfFocus] = useState(false);
  const [tabPressed, setTabPressed] = useState(false);

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

  const parentHover = useSelector(
    (state) => state.transientSlice[todo.id].hover
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
    if (e.key === "Tab") {
      setTabPressed(true);
    }
  };

  const isDateEmpty = isEmpty(date[inputName]);
  const shouldFadeLight =
    isDateEmpty && !selfHover && !props.focused && !selfFocus;
  const shouldFadeMedium =
    !selfFocus &&
    ((props.focused && !selfHover) ||
      (isDateEmpty && selfHover) ||
      (parentHover && !selfHover));
  const shouldFadeHeavy = selfFocus || (!isDateEmpty && selfHover);

  const backgroundColor = shouldFadeLight
    ? props.color.faded(0.25)
    : shouldFadeMedium
    ? props.color.faded(2.5)
    : shouldFadeHeavy
    ? props.color.faded(5)
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
    tabPressed,
    setTabPressed,
    date,
    handleFocus,
    handleKeyDown,
    backgroundColor,
    invisible,
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
