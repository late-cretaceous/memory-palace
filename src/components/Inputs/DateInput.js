import { useDispatch } from "react-redux";
import { editTodo } from "../../redux/persistentSlice";
import { useSelector } from "react-redux";
import styles from "./DateInput.module.css";

const DateInput = ({ todo, name, ...props }) => {
  const dispatch = useDispatch();
  const date = useSelector((state) => state.persistentSlice[todo.id].date);

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
          edit: { date: { ...date, [name]: dayLimits[name] } },
        })
      );
    }
  };

  return (
    <div className={styles["wrapper"]}
    style={{ backgroundColor: props.negativeColor }}>
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
