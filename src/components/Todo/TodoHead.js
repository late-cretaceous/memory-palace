import React, { useState } from "react";
import styles from "./TodoHead.module.css";

const TodoHead = (props) => {
  const [content, setContent] = useState(props.message);
  const [listOpen, setListOpen] = useState(false);

  const typeContentHandler = (e) => {
    setContent(e.target.value);
  };

  const stopBubbleHandler = (e) => {
    e.stopPropagation();
  };

  const toggleListOpenHandler = () => {
    setListOpen(!listOpen);
  };

  return (
    <div
      className={styles.todohead}
      id={props.id}
      onClick={stopBubbleHandler}
    >
      <div className={`${styles["todohead-row"]} ${styles["todohead-row__cancel"]}`}>
        <h4>{props.label}</h4>
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
        autoFocus
      ></textarea>
      <div className={styles["todohead-row"]}>
        <button onClick={toggleListOpenHandler}></button>
      </div>
    </div>
  );
};

export default TodoHead;
