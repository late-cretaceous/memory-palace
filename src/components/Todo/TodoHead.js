import React, { useState, useEffect } from "react";
import styles from "./TodoHead.module.css";

const TodoHead = (props) => {
  const todo = props.todo;
  const [message, setMessage] = useState(todo.message);

  const typeMessageHandler = (e) => {
    setMessage(e.target.value);
  };

  const stopBubbleHandler = (e) => {
    e.stopPropagation();
  };

  useEffect(() => {
    const storeMessage = setTimeout(()=> {
      todo.message = message;

    }, 750);

    return () => {
      clearTimeout(storeMessage);
    }

  },[message])

  return (
    <div className={styles.todohead} id={todo.id} onClick={stopBubbleHandler} {...props.dragHandleProps}>
      <div
        className={`${styles["todohead-row"]} ${styles["todohead-row__cancel"]}`}
      >
        <h4>{todo.label.join('.')}</h4>
        <button
          type="button"
          className="close-button"
          onClick={props.onClose}
          id={todo.id}
        >
          <span id={todo.id}>{"\u2715"}</span>
        </button>
      </div>
      <textarea
        placeholder="Type a to-do"
        onChange={typeMessageHandler}
        value={message}
        autoFocus
      ></textarea>
      <div className={styles["todohead-row"]}>
        <button
          className={props.arrowOpen ? styles.arrowopen : ""}
          onClick={props.onListToggle}
        >
          {"\u25B6"}
        </button>
      </div>
    </div>
  );
};

export default TodoHead;
