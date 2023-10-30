import styles from "./Todo.module.css";

const TodoAdder = (props) => {
  const classes = `${styles[props.className]} ${styles.todo} ${styles.adder}`;

  return (
    <div
      className={classes}
      onClick={(e) => {props.onAdd(e, props.todo.index + 1)}}
      style={props.style}
      onMouseLeave={props.mouseEdgeLeaveHandler}
      data-name={props.mouseName}
    >
      {props.children}
    </div>
  );
};

export default TodoAdder;
