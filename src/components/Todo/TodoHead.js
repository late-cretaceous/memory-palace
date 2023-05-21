import React, { useState, useEffect } from "react";
import styles from "./TodoHead.module.css";

const TodoHead = (props) => {
  const todo = props.todo;
  const [label, setLabel] = useState(
    todo.isParent() ? todo.message : todo.lineage.join(".")
  );
  const [body, setBody] = useState(
    todo.isParent() ? todo.youngestDescendant().message : todo.message
  );

  const typeBodyHandler = (e) => {
    setBody(e.target.value);

    if (todo.isParent) {
      todo.youngestDescendant().message = e.target.value;
    } else {
      todo.message = e.target.value;
    }
  };

  const typeLabelHandler = (e) => {
    setLabel(e.target.value);
    
    todo.message = e.target.value;
  };

  const stopBubbleHandler = (e) => {
    e.stopPropagation();
  };

  useEffect(() => {
    const storeMessage = setTimeout(() => {
      todo.store();
    }, 750);

    return () => {
      clearTimeout(storeMessage);
    };
  }, [body]);

  const showBody = !props.listOpen || !todo.isParent();

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
            onChange={typeLabelHandler}
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
      {showBody && (
        <textarea
          className={`${styles.visible}`}
          placeholder="Type a to-do"
          onChange={typeBodyHandler}
          value={body}
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
