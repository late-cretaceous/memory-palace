import { useDispatch } from "react-redux";
import { editTodo } from "../../redux/persistentSlice";
import { editTransientTodo } from "../../redux/transientSlice";
import { useRef, useState } from "react";
import useInputState from "./useInputState";
import styles from "./DateInput.module.css";
import { repositionFromNewDate } from "../../utilities/dateUtils";

const DayOfWeekInput = ({
  family: { todo, parent, siblings },
  name,
  ...props
}) => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const [initialRender, setInitialRender] = useState(true);
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
    sortedAs
  } = useInputState(todo, props, inputRef, name);

  const [typed, setTyped] = useState(date.dow);

  if (typed !== date.dow) {
    setTyped(date.dow);
  }

  if (initialRender) {
    setInitialRender(false);
    if (!typed) {
      setTyped("Sun");
      dispatchDateChange(dispatch, todo, siblings, "Sun", sortedAs);
    }
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

  const wrapperClasses = `${styles.wrapper} ${styles.dow}`;

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

const days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

const isValidDoW = (dayOfWeek) => {
  return days.hasOwnProperty(dayOfWeek);
};

const getNextDate = (dayOfWeek) => {
  if (isDayInvalidOrBlank(dayOfWeek)) {
    return { year: "", month: "", day: "" };
  }

  let date = new Date();

  while (date.getDay() !== days[dayOfWeek]) {
    date.setDate(date.getDate() + 1);
  }

  return {
    year: finalDigits(date.getFullYear()),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
};

const finalDigits = (num, digits = 2) => {
  return parseInt(num.toString().slice(-digits));
};

const matchingDay = (startString) => {
  if (startString === "") return undefined;

  return Object.keys(days).find((day) =>
    day.toLowerCase().startsWith(startString.toLowerCase())
  );
};

const stringOverflowRestart = (newString, oldString, max = 3) => {
  console.log(`newString: ${newString}`);
  console.log(`oldString: ${oldString}`);
  return newString.length > max
    ? findDiffChar(newString, oldString)
    : newString;
};

const differenceOfStrings = (string, substring) => {
  const substringSet = new Set(substring.toLowerCase().split(""));
  let difference = "";

  for (const char of string.toLowerCase()) {
    if (!substringSet.has(char)) {
      difference += char;
    }
  }

  return difference;
};

const findDiffChar = (str1, str2) => {
  const lowerStr1 = str1.toLowerCase();
  const lowerStr2 = str2.toLowerCase();

  const charCount1 = {};
  for (const char of lowerStr1) {
    charCount1[char] = (charCount1[char] || 0) + 1;
  }

  const charCount2 = {};
  for (const char of lowerStr2) {
    charCount2[char] = (charCount2[char] || 0) + 1;
  }

  for (const char in charCount1) {
    if (!charCount2[char] || charCount1[char] !== charCount2[char]) {
      return char;
    }
  }

  for (const char in charCount2) {
    if (!charCount1[char] || charCount1[char] !== charCount2[char]) {
      return char;
    }
  }

  return undefined;
};

const isStringOrBlank = (str) => {
  return typeof str === "string" || str === "";
};

const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const dispatchDateChange = (dispatch, todo, siblings, newlyTyped, sortedAs) => {
  const newDate = { ...getNextDate(newlyTyped), dow: newlyTyped };

  dispatch(
    editTodo({
      id: todo.id,
      edit: { date: newDate },
    })
  );
  dispatch(
    editTransientTodo({ id: todo.id, edit: { hasSortableChange: true } })
  );

  if (sortedAs === "date") {
    repositionFromNewDate(dispatch, todo, siblings, newDate);
  }
};

const isDayInvalidOrBlank = (day) => {
  return (day && !day.length) || !isValidDoW(day);
};

export default DayOfWeekInput;
