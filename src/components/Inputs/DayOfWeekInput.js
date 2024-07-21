import { useDispatch } from "react-redux";
import { useRef, useState } from "react";
import useInputState from "./useInputState";
import styles from "./DateInput.module.css";
import {
  dispatchDateChange,
  stringOverflowRestart,
  capitalizeFirstLetter,
  differenceOfStrings,
  matchingDay,
  isStringOrBlank,
} from "../../utilities/dateUtils";

const DayOfWeekInput = ({
  family: { todo, parent, siblings },
  name,
  ...props
}) => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const [suggestion, setSuggestion] = useState("");

  const {
    setSelfHover,
    setSelfFocus,
    confirmKeyPressed,
    setConfirmKeyPressed,
    date,
    handleFocus,
    handleKeyDown,
    backgroundColor,
    invisible,
    sortedAs,
  } = useInputState(todo, props, inputRef, name);

  const [typed, setTyped] = useState(date.dow);

  if (typed !== date.dow) {
    setTyped(date.dow);
  }

  const handleInputChange = (e) => {
    if (!isStringOrBlank(e.target.value)) return;

    console.log(`typed: ${typed}`);
    const { dow, ...previousDate } = date;
    const blankInput = e.target.value === "";
    console.log(
      `target value: ${e.target.value}\ntype: ${typeof e.target.value}`
    );

    const value = stringOverflowRestart(e.target.value, typed);
    console.log(`value: ${value}`);

    const dayCompleted = matchingDay(value);
    const fullDisplayDay =
      dayCompleted || (blankInput ? "" : matchingDay(typed));
    console.log(`dayCompleted: ${dayCompleted}`);
    console.log(`fullDisplayDay: ${fullDisplayDay}`);

    const newlyTyped = dayCompleted
      ? capitalizeFirstLetter(value)
      : blankInput
      ? ""
      : typed;
    console.log(`newlyTyped: ${newlyTyped}`);
    setTyped(newlyTyped);

    const suggestionRemainder = differenceOfStrings(fullDisplayDay, newlyTyped);
    console.log(`suggestionRemainder: ${suggestionRemainder}`);
    setSuggestion(suggestionRemainder);

    dispatchDateChange(dispatch, todo, siblings, newlyTyped, sortedAs);
  };

  const handleBlur = () => {
    setSelfFocus(false);
    const completedDay = typed + suggestion;

    setTyped(completedDay);
    setSuggestion("");
    dispatchDateChange(dispatch, todo, siblings, completedDay, sortedAs);

    if (!confirmKeyPressed) {
      props.onBlur();
    } else {
      setConfirmKeyPressed(false);
    }
  };

  const wrapperClasses = `${styles.wrapper} ${styles.dow} ${
    invisible ? styles.hidden : ""
  }`;

  return (
    <div
      className={wrapperClasses}
      style={{ backgroundColor: backgroundColor }}
      onMouseEnter={() => setSelfHover(true)}
      onMouseLeave={() => setSelfHover(false)}
      ref={wrapperRef}
    >
      <span
        className={`${styles["text-display"]}`}
        style={{ color: props.color }}
      >
        {typed}
      </span>
      <span
        className={`${styles["text-display"]} ${styles.suggestion}`}
        style={{ color: props.color }}
      >
        {suggestion}
      </span>
      <input
        className={`${styles["input-el"]} ${styles.dow}`}
        type="text"
        name={"dow"}
        value={typed}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        autoComplete="off"
      />
    </div>
  );
};

export default DayOfWeekInput;
