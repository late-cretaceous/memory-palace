import React, { useState, useEffect } from "react";
import styles from "./Todo.module.css";

const Todo = React.forwardRef((props, ref) => {
  const [content, setContent] = useState("");

  const stopBubbleHandler = (e) => {
    e.stopPropagation();
  };

  const editContentHandler = (e) => {
    setContent(e.target.value);
  };

  useEffect(() => {
    console.log("todo effect");
  }, [content]);

  return (
    <div
      ref={ref}
      className={styles.todo}
      id={props.id}
      onClick={stopBubbleHandler}
      {...props.provided.draggableProps}
      {...props.provided.dragHandleProps}
    >
      <div className={`${styles["todo-row"]} ${styles["todo-row__cancel"]}`}>
        <h4>{props.id}</h4>
        <button
          type="button"
          className="close-button"
          onClick={props.onClose}
          id={props.id}
        >
          X
        </button>
      </div>
      <textarea
        placeholder="Name"
        onChange={editContentHandler}
        value={content}
      ></textarea>
    </div>
  );
});

export default Todo;
