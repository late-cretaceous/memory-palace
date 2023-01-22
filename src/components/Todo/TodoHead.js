import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const typingContent = setTimeout(() => {
      const todo = JSON.parse(localStorage.getItem(props.id));
      console.log(todo);
      todo.message = content;
      localStorage.setItem(props.id, JSON.stringify(todo));
    }, 2000);

    return () => {
      clearTimeout(typingContent);
    };
  }, [content]);

  return (
    <div
      className={styles.todo}
      id={props.id}
      onClick={stopBubbleHandler}
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
        autoFocus
      ></textarea>
      <div className={styles["todo-row"]}>
        <button onClick={toggleListOpenHandler}></button>
      </div>
    </div>
  );
};

export default TodoHead;
