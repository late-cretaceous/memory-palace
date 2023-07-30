import React, { useState, useEffect } from "react";
import styles from "./TodoHead.module.css";
import TodoBottom from "./TodoBottom";
import Edgebox from "./Edgebox";
import { CSSTransition } from "react-transition-group";

const TodoHead = (props) => {
  const todo = props.todo;
  const isParent = todo.isParent();
  const listOpen = props.listOpen;

  const [label, setLabel] = useState(todo.lineage.join("."));
  const [body, setBody] = useState(
    isParent ? todo.youngestDescendant().message : todo.message
  );
  const [hover, setHover] = useState(false);

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
      onMouseEnter={() => {setHover(true)}}
      onMouseLeave={() => {setHover(false)}}
    >
      <Edgebox
        mouseEdgeEnterHandler={props.mouseEdgeEnterHandler}
        mouseEdgeLeaveHandler={props.mouseEdgeLeaveHandler}
        todoIndex={todo.index}
        top={true}
      />
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
        <CSSTransition
          in={!listOpen}
          timeout={500}
          unmountOnExit
          classNames={{ ...styles }}
        >
          <textarea
            placeholder="Type a to-do"
            onChange={typeBodyHandler}
            value={body}
            autoFocus
          ></textarea>
        </CSSTransition>
        <TodoBottom
          hover={hover}
          listOpen={listOpen}
          onListToggle={props.onListToggle}
        />
      </div>
      {!listOpen && (
        <Edgebox
          mouseEdgeEnterHandler={props.mouseEdgeEnterHandler}
          mouseEdgeLeaveHandler={props.mouseEdgeLeaveHandler}
          todoIndex={todo.index}
          top={false}
        />
      )}
    </div>
  );
};

export default TodoHead;
