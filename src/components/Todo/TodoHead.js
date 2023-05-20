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
    const storeMessage = setTimeout(() => {
      todo.message = message;
      todo.store();
    }, 750);

    return () => {
      clearTimeout(storeMessage);
    };
  }, [message]);

  const label = todo.isParent() ? message : todo.lineage.join(".");
  const display = todo.isParent() ? todo.youngestDescendant().message : message;
  const showDisplay = !props.listOpen || !todo.isParent();

  return (
    <div
      className={styles.todohead}
      style={{
        backgroundColor: props.color.toString(),
        color: props.color.negative().toString(),
      }}
      id={todo.id}
      onClick={stopBubbleHandler}
      {...props.dragHandleProps}
    >
      <div
        className={`${styles["todohead-row"]} ${styles["todohead-row__cancel"]}`}
      >
        {todo.isParent() ? (
          <textarea
            className={`${styles.label}`}
            placeholder="Type a list title"
            onChange={typeMessageHandler}
            value={label}
          ></textarea>
        ) : (
          <h4 className={`${styles.label}`}>{label}</h4>
        )}
        <button
          type="button"
          className="close-button"
          onClick={props.onClose}
          id={todo.id}
        >
          <span id={todo.id}>{"\u2715"}</span>
        </button>
      </div>
      {showDisplay && (
        <textarea
          className={`${styles.display}`}
          placeholder="Type a to-do"
          onChange={typeMessageHandler}
          value={display}
          autoFocus
        ></textarea>
      )}

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
