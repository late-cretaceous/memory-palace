import React, { useState } from "react";
import styles from "./TodoHead.module.css";

const TodoHead = (props) => {
  const [content, setContent] = useState(props.message);

  const typeContentHandler = (e) => {
    setContent(e.target.value);
  };

  const stopBubbleHandler = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.todohead} id={props.id} onClick={stopBubbleHandler}>
      <div
        className={`${styles["todohead-row"]} ${styles["todohead-row__cancel"]}`}
      >
        <h4>{props.label}</h4>
        <button
          type="button"
          className="close-button"
          onClick={props.onClose}
          id={props.id}
        >
          <span id={props.id}>{"\u2715"}</span>
        </button>
      </div>
      <textarea
        placeholder="Type a to-do"
        onChange={typeContentHandler}
        value={content}
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
