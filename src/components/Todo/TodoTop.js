import TodoExpander from "./TodoExpander";
import styles from "./TodoHead.module.css";

const TodoTop = (props) => {
  const todo = props.todo;
  return (
    <TodoExpander className={styles["todo-top"]} hover={props.hover}>
      <h5 className={`${styles.label}`}>
        {todo.isParent() ? (
          <textarea
            placeholder="Type a list title"
            onChange={props.onLabelType}
            value={props.label}
          ></textarea>
        ) : (
          props.label
        )}
      </h5>
      <button
        type="button"
        className="close-button"
        onClick={props.onClose}
        id={todo.id}
      >
        <span id={todo.id}>{"\u2715"}</span>
      </button>
    </TodoExpander>
  );
};

export default TodoTop;
