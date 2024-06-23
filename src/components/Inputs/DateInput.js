import { useDispatch } from "react-redux";
import { editTodo } from "../../redux/persistentSlice";
import { editTransientTodo } from "../../redux/transientSlice";
import { useRef, useEffect } from "react";
import useInputState from "./useInputState";
import styles from "./DateInput.module.css";

const DateInput = ({ family: {todo, siblings, parent}, name, ...props }) => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const { inputWidths, sendInputWidth, setInputHeight, inputHeight } = props;

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
  } = useInputState(todo, props, inputRef, name);

  if (props.advanceField === "dow" && name === "month") {
    inputRef.current.focus();
    props.setAdvanceField(null);
  } else if (props.advanceField === "month" && name === "day") {
    inputRef.current.focus();
    props.setAdvanceField(null);
  } else if (props.advanceField === "day" && name === "year") {
    inputRef.current.focus();
    props.setAdvanceField(null);
  }

  useEffect(() => {
    if (wrapperRef.current) {
      const newWidth = lengthWithMargins(wrapperRef.current, "width");
      const newHeight = lengthWithMargins(wrapperRef.current, "height");

      if (inputWidths[name] !== newWidth) {
        sendInputWidth(name, newWidth);
      }

      if (newHeight !== inputHeight) {
        setInputHeight(newHeight);
      }
    }
  }, [inputWidths, name, sendInputWidth, setInputHeight, inputHeight]);

  const handleInputChange = (e) => {
    const paddedValue = String(e.target.value).padStart(2, "0");
    const twoDigitValue = paddedValue.slice(-2);
    const newDate = { ...date, [name]: twoDigitValue };

    const newDoW = dayOfWeek(newDate.month, newDate.day, newDate.year);
    const finalDoW = newDoW !== "Invalid Date" ? newDoW : date.dow;

    if (!isNaN(twoDigitValue)) {
      dispatch(
        editTodo({
          id: todo.id,
          edit: { date: { ...newDate, dow: finalDoW } },
        })
      );

      dispatch(
        editTransientTodo({ id: todo.id, edit: { hasSortableChange: true } })
      );
    }
  };

  const handleBlur = () => {
    setSelfFocus(false);

    if (!confirmKeyPressed) {
      props.onBlur();
    } else {
      if (name === "year") {
        props.onBlur();
      }
      setConfirmKeyPressed(false);
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

  const wrapperClasses = `${styles.wrapper} ${styles[name]} ${
    styles.dateinput
  } ${invisible ? styles.hidden : ""} ${
    props.formHover || props.focused ? styles["form-selected"] : ""
  }`;

  return (
    <div
      className={wrapperClasses}
      style={{ backgroundColor: backgroundColor }}
      onMouseEnter={() => setSelfHover(true)}
      onMouseLeave={() => setSelfHover(false)}
      ref={wrapperRef}
    >
      <span className={styles["text-display"]} style={{ color: props.color }}>
        {date[name]}
      </span>
      <input
        style={{ color: props.color }}
        className={`${styles["input-el"]} ${styles.dateinput}`}
        type="text"
        name={name}
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

const lengthWithMargins = (element, dimension) => {
  const style = window.getComputedStyle(element);
  const [marginStart, marginEnd] =
    dimension === "width"
      ? ["marginLeft", "marginRight"]
      : ["marginTop", "marginBottom"];

  const margin = parseFloat(style[marginStart]) + parseFloat(style[marginEnd]);

  return element.getBoundingClientRect()[dimension] + margin;
};

const dayOfWeek = (month, day, year) => {
  const date = new Date(`${month}/${day}/${year}`);
  return date.toLocaleDateString("en-US", { weekday: "short" });
};

export default DateInput;
