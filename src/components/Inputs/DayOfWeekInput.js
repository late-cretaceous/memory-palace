import { useDispatch } from "react-redux";
import { editTodo } from "../../redux/persistentSlice";
import { editTransientTodo } from "../../redux/transientSlice";
import { useRef } from "react";
import useInputState from "./useInputState";
import styles from "./DateInput.module.css";

const DayOfWeekInput = ({ todo, name, ...props }) => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

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
    if (
      (isNaN(e.target.value) || !Boolean(e.target.value)) &&
      e.target.value.length < 4
    ) {
      dispatch(
        editTodo({
          id: todo.id,
          edit: { date: { ...date, dow: e.target.value } },
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

export default DayOfWeekInput;
