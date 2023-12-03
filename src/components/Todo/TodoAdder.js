import styles from "./Todo.module.css";

const TodoAdder = ({ parent, ...props }) => {
  const classes = `${styles[props.className]} ${styles.todo} ${styles.adder}`;

  return (
    <div
      className={classes}
      onClick={() => {
        props.clickAddHandler(parent, false);
      }}
      style={props.style}
      onMouseLeave={props.mouseEdgeLeaveHandler}
      data-name={props.mouseName}
    >
      {props.children}
    </div>
  );
};

export default TodoAdder;
