import React, { useState, useEffect } from "react";
import styles from "./TodoHead.module.css";
import TodoBottom from "./TodoBottom";

const TodoHead = (props) => {
  const todo = props.todo;
  const [label, setLabel] = useState(
    todo.isParent() ? todo.message : todo.lineage.join(".")
  );
  const [body, setBody] = useState(
    todo.isParent() ? todo.youngestDescendant().message : todo.message
  );
  
  const todoIsParent = todo.isParent();
  const showBody = !props.listOpen || !todo.isParent();

  useEffect(() => {
    setLabel(todoIsParent ? todo.message : todo.lineage.join("."));
    setBody(todoIsParent ? todo.youngestDescendant().message : todo.message);
  }, [todoIsParent, showBody])

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
      if (todo.isParent) todo.youngestDescendant().store();
    }, 750);

    return () => {
      clearTimeout(storeMessage);
    };
  }, [body, label]);

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
        <h5 className={`${styles.label}`}>
          {todo.isParent() ? (
            <textarea
              placeholder="Type a list title"
              onChange={typeLabelHandler}
              value={label}
            ></textarea>
          ) : (
            label
          )}
        </h5>
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

      <TodoBottom arrowOpen={props.arrowOpen} onListToggle={props.onListToggle} />

    </div>
  );
};

export default TodoHead;
