import styles from "./TodoHead.module.css";

const TodoBottom = (props) => {
  const classes = `${styles["todohead-row"]} ${styles["todo-bottom"]} ${
    props.hover ? styles.opaque : styles.transparent
  }`;

  return (
    <div className={classes}>
      <span style={{whiteSpace: "pre"}}>{props.todo.list.length ? "+" : " "}</span>
      <button
        className={props.listOpen ? styles.arrowopen : ""}
        onClick={props.onListToggle}
      >
        <span>{"\u25B6"}</span>
      </button>
    </div>
  );
};

export default TodoBottom;
