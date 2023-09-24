import styles from "./TodoHead.module.css";
import CloseIcon from "../../assets/CloseIcon";

const TodoTop = props => {
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
        onClick={props.onClose}
        id={props.id}
      >
        <CloseIcon id={props.id} fill={props.fontColor} />
      </button>
    </div>
  );
};

export default TodoTop;