import React, { useState, useEffect } from "react";
import styles from "./TodoHead.module.css";
import TodoBottom from "./TodoBottom";
import Edgebox from "./Edgebox";
import TextArea from "../TextArea";
import { CSSTransition } from "react-transition-group";
import { ReactComponent as CloseIcon } from "../../assets/close.svg";

import { useSelector } from "react-redux";

const TodoHead = (props) => {
  const todo = props.todo;
  const isParent = todo.isParent();
  const listOpen = props.listOpen;

  const [body, setBody] = useState(todo.message);
  const [hover, setHover] = useState(false);

  const labelsVisible = useSelector((state) => state.labels.visible);

  const typeBodyHandler = (textInput) => {
    setBody(textInput);

    todo.message = textInput;
  };

  useEffect(() => {
    const storeMessage = setTimeout(() => {
      todo.store();
      if (isParent) todo.youngestDescendant().store();
    }, 750);

    return () => {
      clearTimeout(storeMessage);
    };
  }, [body]);

  const todoHeadStyles = `${styles.todohead} ${
    listOpen ? styles.preview : styles.full
  }`;

  const labelDisplay = listOpen
    ? body
    : labelsVisible
    ? todo.lineage.join(".")
    : "";

  const fontColor = props.color.negative().toString();

  return (
    <div
      className={todoHeadStyles}
      style={{
        backgroundColor: props.color.toString(),
        color: fontColor,
      }}
      id={todo.id}
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
    >
      <Edgebox
        mouseEdgeEnterHandler={props.mouseEdgeEnterHandler}
        mouseEdgeLeaveHandler={props.mouseEdgeLeaveHandler}
        todoIndex={todo.index}
        top={true}
      />
      <div
        className={styles.todoface}
        {...props.dragHandleProps}
        style={{ paddingLeft: `${1 + (todo.lineage.length - 1) * 2}rem` }}
      >
        <div
          className={`${styles["todohead-row"]} ${styles["todohead-row__cancel"]}`}
        >
          <h5 className={`${styles.label}`}>{labelDisplay}</h5>
          <button
            type="button"
            className={`${styles.button} ${
              hover ? styles.opaque : styles.transparent
            }`}
            onClick={props.onClose}
            id={todo.id}
          >
            <CloseIcon id={todo.id} fill={fontColor} />
          </button>
        </div>
        <CSSTransition
          in={!listOpen}
          timeout={500}
          unmountOnExit
          classNames={{ ...styles }}
        >
          <TextArea
            text={body}
            containerHover={hover}
            inputHandler={typeBodyHandler}
            placeholder={"Type a to-do"}
          />
        </CSSTransition>
        <TodoBottom
          hover={hover}
          listOpen={listOpen}
          onListToggle={props.onListToggle}
          todo={todo}
          color={fontColor}
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
