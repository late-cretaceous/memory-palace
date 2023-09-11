import styles from "./TodoHead.module.css";
import { ReactComponent as Arrow } from "../../assets/triangle.svg";

const TodoBottom = (props) => {
  const classes = `${styles["todohead-row"]} ${styles["todo-bottom"]} ${
    props.hover ? styles.opaque : styles.transparent
  }`;

  return (
    <div className={classes}>
      {!props.isStarter && (
        <button
          className={`${styles.button} ${
            props.listOpen ? styles.arrowopen : ""
          }`}
          onClick={props.onListToggle}
        >
          <span>
            <Arrow
              style={{
                fill: props.todo.isParent() ? props.color : "none",
                stroke: props.color,
                strokeWidth: "1.5px",
              }}
            />
          </span>
        </button>
      )}
    </div>
  );
};

export default TodoBottom;
