import React, { useState, useEffect } from "react";
import styles from "./TodoHead.module.css";
import TodoBottom from "./TodoBottom";

const TodoHead = (props) => {
  const todo = props.todo;
  const isParent = todo.isParent();
  const listOpen = props.listOpen;

  const [label, setLabel] = useState(todo.lineage.join("."));
  const [body, setBody] = useState(
    isParent ? todo.youngestDescendant().message : todo.message
  );
  const [hover, setHover] = useState(false);
  const [edgeBoxTimeout, setEdgeBoxTimeout] = useState(null);

  useEffect(() => {
    setLabel(isParent || listOpen ? todo.message : todo.lineage.join("."));
    setBody(isParent ? todo.youngestDescendant().message : todo.message);
  }, [isParent, listOpen]);

  const typeBodyHandler = (e) => {
    setBody(e.target.value);

    if (isParent) {
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

  const hoverHandler = () => {
    setHover((prevHover) => !prevHover);
  };

  const onEdgeBoxEnter = (e, index) => {
    const edgeTimeoutId = setTimeout(() => {
      props.mouseEdgeEnterHandler(e, index);
      setEdgeBoxTimeout(null);
    }, 100);

    setEdgeBoxTimeout(edgeTimeoutId);
  };

  const onEdgeBoxLeave = (e) => {
    if (edgeBoxTimeout) {
      clearTimeout(edgeBoxTimeout);
      setEdgeBoxTimeout(null);
      return;
    }

    const mouseTo = e.relatedTarget.dataset
      ? e.relatedTarget.dataset.name
      : null;

    if (mouseTo !== "add" && mouseTo !== "edgebox") {
      props.mouseEdgeLeaveHandler();
    }
    
    setEdgeBoxTimeout(null);
  };

  useEffect(() => {
    const storeMessage = setTimeout(() => {
      todo.store();
      if (isParent) todo.youngestDescendant().store();
    }, 750);

    return () => {
      clearTimeout(storeMessage);
    };
  }, [body, label]);

  const todoHeadStyles = `${styles.todohead} ${
    listOpen ? styles.preview : styles.full
  }`;

  return (
    <div
      className={todoHeadStyles}
      style={{
        backgroundColor: props.color.toString(),
        color: props.color.negative().toString(),
      }}
      id={todo.id}
      onClick={stopBubbleHandler}
      onMouseEnter={hoverHandler}
      onMouseLeave={hoverHandler}
    >
      <div
        className={styles["edge-hitbox"]}
        onMouseEnter={(e) => {
          onEdgeBoxEnter(e, todo.index);
        }}
        onMouseLeave={onEdgeBoxLeave}
        data-name="edgebox"
      ></div>
      <div className={styles.todoface} {...props.dragHandleProps}>
        <div
          className={`${styles["todohead-row"]} ${styles["todohead-row__cancel"]}`}
        >
          <h5 className={`${styles.label}`}>
            {isParent ? (
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
            className={`${hover ? styles.opaque : styles.transparent}`}
            onClick={props.onClose}
            id={todo.id}
          >
            <span id={todo.id}>{"\u2715"}</span>
          </button>
        </div>
        {!listOpen && (
          <textarea
            className={`${styles.visible}`}
            placeholder="Type a to-do"
            onChange={typeBodyHandler}
            value={body}
            autoFocus
          ></textarea>
        )}
        <TodoBottom
          hover={hover}
          listOpen={listOpen}
          onListToggle={props.onListToggle}
        />
      </div>
      {!listOpen && (
        <div
          className={styles["edge-hitbox"]}
          onMouseEnter={(e) => {
            onEdgeBoxEnter(e, todo.index + 1);
          }}
          onMouseLeave={onEdgeBoxLeave}
        ></div>
      )}
    </div>
  );
};

export default TodoHead;
