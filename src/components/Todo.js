import React from "react";
import styles from "./Todo.module.css";
import Card from "./UI/Card";

const Todo = React.forwardRef((props, ref) => {
  const stopBubbleHandler = e => {
    e.stopPropagation();
  }

  return (
    <div
      ref={ref}
      className={styles.todo}
      id={props.id}
      onClick={stopBubbleHandler}
      {...props.provided.draggableProps}
      {...props.provided.dragHandleProps}
    >
      <h3>{props.id}</h3>
      <button type='button' className="close-button" onClick={props.onClose} id={props.id}>
        X
      </button>
    </div>
  );
});

export default Todo;
