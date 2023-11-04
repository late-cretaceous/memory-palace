import styles from "./TodoHead.module.css";
import CloseIcon from "../../assets/CloseIcon";
import { useDispatch } from "react-redux";
import { removeTodo } from "../../redux/persistentSlice";

const TodoTop = ({ id, ...props }) => {
  const dispatch = useDispatch();
  const removeSelfHandler = () => {
    dispatch(removeTodo(id));
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
        id={id}
      >
        <CloseIcon fill={props.fontColor} />
      </button>
    </div>
  );
};

export default TodoTop;
