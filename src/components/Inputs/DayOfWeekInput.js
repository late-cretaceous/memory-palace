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
  const [suggestion, setSuggestion] = useState('');

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
    const { dow, ...previousDate } = date;
    const dowDate = validateDayOfWeek(e.target.value)
      ? getNextDate(e.target.value, date)
      : previousDate;
    const newDoW = matchingDay(e.target.value) || dow;
    console.log(newDoW);

    if (
      (isNaN(e.target.value) || !Boolean(e.target.value)) &&
      e.target.value.length < 4
    ) {
      dispatch(
        editTodo({
          id: todo.id,
          edit: { date: { ...dowDate, dow: e.target.value } },
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
      <input
        style={{ color: props.color }}
        className={`${styles["input-el"]} ${styles.dow}`}
        type="text"
        name={"dow"}
        value={date.dow}
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

const validateDayOfWeek = (dayOfWeek) => {
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
}

export default DayOfWeekInput;
