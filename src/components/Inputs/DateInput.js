import { useDispatch, useSelector, } from "react-redux";
import { editTodo } from "../../redux/persistentSlice";
import { editTransientTodo } from "../../redux/transientSlice";
import { useState, useRef, useEffect } from "react";
import styles from "./DateInput.module.css";

const DateInput = ({ todo, name, inputWidths, sendInputWidth, ...props }) => {
  const [selfHover, setSelfHover] = useState(false);
  const [selfFocus, setSelfFocus] = useState(false);
  const [tabPressed, setTabPressed] = useState(false);

  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (wrapperRef.current) {
      const newWidth = calculateWidthWithMargins(wrapperRef.current);

      if (inputWidths[name] !== newWidth) {
        sendInputWidth(name, newWidth);
      }
    }
  }, [inputWidths, name, sendInputWidth]);

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

  const handleMouseEnter = () => setSelfHover(true);
  const handleMouseLeave = () => setSelfHover(false);
  const handleFocus = () => {
    setSelfFocus(true);
    props.onFocus();

    if (inputRef.current) {
      inputRef.current.select();
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      setTabPressed(true);
    }
  };

  const handleInputChange = (e) => {
    const paddedValue = String(e.target.value).padStart(2, "0");
    const twoDigitValue = paddedValue.slice(-2);

    if (!isNaN(twoDigitValue)) {
      dispatch(
        editTodo({
          id: todo.id,
          edit: { date: { ...date, [name]: twoDigitValue } },
        })
      );

      dispatch(
        editTransientTodo({ id: todo.id, edit: { hasSortableChange: true } })
      );
    }
  };

  const handleBlur = () => {
    setSelfFocus(false);

    if (!tabPressed) {
      props.onBlur();
    } else {
      if (name === "year") {
        props.onBlur();
      }
      setTabPressed(false);
    }

    const dayLimits = {
      month: 12,
      day: 31,
      year: 99,
    };

    const exceeds =
      (name === "month" && date[name] > dayLimits[name]) ||
      (name === "day" && date[name] > dayLimits[name]) ||
      (name === "year" && date[name] > dayLimits[name]);

    if (exceeds) {
      dispatch(
        editTodo({
          id: todo.id,
          edit: {
            date: { ...date, [name]: dayLimits[name].toString() },
          },
        })
      );
    }
  };

  const isDateEmpty = isEmpty(date[name]);
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
        props.old,
        parentHover,
        parentSortedAs
      ));

  const wrapperClasses = `${styles.wrapper} ${invisible ? styles.hidden : ""}`;

  return (
    <div
      className={wrapperClasses}
      style={{ backgroundColor: backgroundColor }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={wrapperRef}
    >
      <input
        style={{ color: props.color }}
        className={styles["input-el"]}
        type="text"
        name={name}
        value={date[name]}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        ref={inputRef}
      />
    </div>
  );
};

const isEmpty = (field) => !Boolean(field);

const isOldAndCascadingIntoDate = (inCascade, old, sort) => {
  return inCascade && old && sort === "date";
};

const recentSortableChangeAndNotHoveredInManual = (hover, old, sortedAs) => {
  return !old && !hover && sortedAs === "manual";
};

const calculateWidthWithMargins = (element) => {
  const style = window.getComputedStyle(element);
  const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);

  console.log(
    `wrapper width: ${element.getBoundingClientRect().width + margin}`
  );
  return element.getBoundingClientRect().width + margin;
};

export default DateInput;
