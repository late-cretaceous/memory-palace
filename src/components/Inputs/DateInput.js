import { useDispatch } from "react-redux";
import { editTodo } from "../../redux/persistentSlice";
import { useSelector } from "react-redux";
import styles from "./DateInput.module.css";

const DateInput = ({ todo, name, ...props }) => {
  const dispatch = useDispatch();
  const date = useSelector(
    (state) =>
      state.persistentSlice[todo.id]?.date ?? {
        month: null,
        day: null,
        year: null,
      }
  );

  const parentSortedAs = useSelector(
    (state) => state.transientSlice[todo.id].sortedAs
  );

  const parentHover = useSelector(
    (state) => state.transientSlice[todo.id].hover
  );

  const handleInputChange = (e) => {
    const twoDigitValue = e.target.value.slice(0, 2);

    if (!isNaN(twoDigitValue)) {
      dispatch(
        editTodo({
          id: todo.id,
          edit: { date: { ...date, [name]: twoDigitValue } },
        })
      );
    }
  };

  const handleBlur = () => {
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
          edit: { date: { ...date, [name]: dayLimits[name].toString() } },
        })
      );
    }
  };

  const backgroundColor = !Boolean(date[name])
    ? props.color.faded(0.25)
    : parentHover
    ? props.color.faded(3)
    : props.color.faded(1);

  const wrapperClasses = `${styles.wrapper} ${
    parentSortedAs === "date" ? "" : styles.hidden
  }`;

  return (
    <div
      className={wrapperClasses}
      style={{ backgroundColor: backgroundColor }}
    >
      <input
        style={{ color: props.color }}
        className={styles["input-el"]}
        type="text"
        name={name}
        value={date[name]}
        onChange={handleInputChange}
        onBlur={handleBlur}
      />
    </div>
  );
};

export default DateInput;
