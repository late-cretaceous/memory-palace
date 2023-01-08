import React, { useState, useEffect } from "react";
import styles from "./Todo.module.css";

const Todo = React.forwardRef((props, ref) => {
  const [content, setContent] = useState("");

  const typeContentHandler = (e) => {
    setContent(e.target.value);
  };

  const stopBubbleHandler = (e) => {
    e.stopPropagation();
  };

  useEffect(() => {
    const typingContent = setTimeout(() => {
      console.log('Content typed')
    }, 2000);
    
    return () => {
      clearTimeout(typingContent);
    }
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
        placeholder="Type a to-do"
        onChange={typeContentHandler}
        value={content}
      ></textarea>
    </div>
  );
});

export default Todo;
