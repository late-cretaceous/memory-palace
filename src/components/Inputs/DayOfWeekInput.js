import { useDispatch } from "react-redux";
import { editTodo } from "../../redux/persistentSlice";
import { editTransientTodo } from "../../redux/transientSlice";
import { useRef, useState } from "react";
import useInputState from "./useInputState";
import styles from "./DateInput.module.css";

const DayOfWeekInput = ({ todo, name, ...props }) => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const [typed, setTyped] = useState(false);
  const [suggestion, setSuggestion] = useState("");

  const {
    setSelfHover,
    setSelfFocus,
    tabPressed,
    setTabPressed,
    date,
    handleFocus,
    handleKeyDown,
    backgroundColor,
    invisible,
  } = useInputState(todo, props, inputRef, name);

  const handleInputChange = (e) => {
    if (!isStringOrBlank(e.target.value)) return;

    const { dow, ...previousDate } = date;

    const value = stringOverflowRestart(e.target.value, typed);
    console.log(value);

    const dayCompleted = matchingDay(value);
    const newlyTyped = dayCompleted ? value : typed;
    setTyped(newlyTyped);

    const suggestionRemainder = differenceOfStrings(dayCompleted, newlyTyped);
    setSuggestion(suggestionRemainder);

    if (isValidDoW(newlyTyped)) {
      console.log("valid");

      const dowDate = getNextDate(newlyTyped);
      dispatch(
        editTodo({
          id: todo.id,
          edit: { date: { ...dowDate, dow: newlyTyped } },
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
  return Object.keys(days).find((day) =>
    day.toLowerCase().startsWith(startString.toLowerCase())
  );
};

const stringOverflowRestart = (newString, oldString, max = 3) => {
  return newString.length > max
    ? findDiffChar(newString, oldString)
    : newString;
};

function differenceOfStrings(string, substring) {
  const substringSet = new Set(substring);
  let difference = "";

  for (const char of string) {
    if (!substringSet.has(char)) {
      difference += char;
    }
  }

  return difference;
}

function findDiffChar(str1, str2) {
  const lowerStr1 = str1.toLowerCase();
  const lowerStr2 = str2.toLowerCase();

  const charSet1 = new Set(lowerStr1.split(""));

  for (const char of lowerStr2) {
    if (!charSet1.has(char)) {
      return char;
    }
  }

  const charSet2 = new Set(lowerStr2.split(""));

  for (const char of lowerStr1) {
    if (!charSet2.has(char)) {
      return char;
    }
  }

  return undefined;
}

const isStringOrBlank = (str) => {
  return typeof str === "string" || str === "";
};
export default DayOfWeekInput;
