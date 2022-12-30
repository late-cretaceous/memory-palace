import React from "react";
import styles from "./Todo.module.css";
import Card from "./UI/Card";

const Todo = React.forwardRef((props, ref) => {
  return (
    <div
      ref={ref} 
      className={styles.todo}
      id={props.id}
      {...props.provided.draggableProps}
      {...props.provided.dragHandleProps}
    >
      <h3>{props.content}</h3>
    </div>
  );
});

export default Todo;
