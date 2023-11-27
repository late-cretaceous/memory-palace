import styles from "./TodoHead.module.css";
import CloseIcon from "../../assets/CloseIcon";
import { useDispatch, useSelector } from "react-redux";
import { removeTodo } from "../../utilities/reduxUtils";
import { listHierarchy } from "../../utilities/todoUtils";

const TodoTop = ({ todo, ...props }) => {
  const hierarchy = useSelector((state) =>
    listHierarchy(todo, state.persistentSlice)
  );

  const dispatch = useDispatch();
  const removeSelfHandler = () => {
    dispatch(removeTodo(todo.id, hierarchy));
  };

  return (
    <div
      className={`${styles["todohead-row"]} ${styles["todohead-row__cancel"]}`}
    >
      <h5 className={`${styles.label}`}>{props.labelDisplay}</h5>
      <button
        type="button"
        className={`${styles.button} ${
          props.hover ? styles.opaque : styles.transparent
        }`}
        onClick={removeSelfHandler}
        id={todo.id}
      >
        <CloseIcon fill={props.fontColor} />
      </button>
    </div>
  );
};

export default TodoTop;
