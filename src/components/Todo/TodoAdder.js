import styles from "./Todo.module.css";

const TodoAdder = (props) => {
  const classes = `${styles[props.className]} ${styles.todo} ${styles.phantom}`;

  return (
    <div
      className={classes}
      onClick={(e) => {props.onAdd(e, props.index + 1)}}
      style={props.style}
      onMouseLeave={props.mouseEdgeLeaveHandler}
      data-name={"add"}
    >
      {props.children}
    </div>
  );
};

export default TodoAdder;
