import styles from "./TodoHead.module.css";

const TodoBottom = (props) => {
    console.log(props.arrowOpen);
  return (
    <div className={styles["todohead-row"]}>
      <button
        className={props.arrowOpen ? styles.arrowopen : ""}
        onClick={props.onListToggle}
      >
        {"\u25B6"}
      </button>
    </div>
  );
};

export default TodoBottom;
