import styles from "./TodoHead.module.css";
import buttonStyle from "../UI/button.module.css";
import CloseIcon from "../../assets/CloseIcon";
import { useDispatch } from "react-redux";
import { removeTodo } from "../../utilities/reduxUtils";
import { useSelector } from "react-redux";
import DateInput from "./DateInput";

const TodoTop = ({ family, ...props }) => {
  const dispatch = useDispatch();
  const position = useSelector(
    (state) => state.transientSlice[family.todo.id].position
  );
  const removeSelfHandler = () => {
    dispatch(removeTodo(family, position));
  };

  return (
    <div
      className={`${styles["todohead-row"]} ${styles["todohead-row__cancel"]}`}
    >
      <h5 className={`${styles.label}`}>{props.labelDisplay}</h5>

      <button
        type="button"
        className={`${buttonStyle.button} ${
          props.hover ? styles.opaque : styles.transparent
        }`}
        onClick={removeSelfHandler}
        id={family.todo.id}
      >
        <CloseIcon fill={props.fontColor} />
      </button>
    </div>
  );
};

export default TodoTop;
