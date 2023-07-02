import styles from "./TodoHead.module.css";

const TodoBottom = (props) => {
  const classes = `${styles["todohead-row"]} ${props.hover ? styles.opaque : styles.transparent}`;

  return (
    <div
      className={classes}
    >
      <button
        className={props.listOpen ? styles.arrowopen : ""}
        onClick={props.onListToggle}
      >
        {"\u25B6"}
      </button>
    </div>
  );
};

export default TodoBottom;
