import React, { useState, useEffect } from "react";
import styles from "./TodoHead.module.css";
import TodoBottom from "./TodoBottom";
import Edgebox from "./Edgebox";
import TextArea from "../TextArea";
import { CSSTransition } from "react-transition-group";

const TodoHead = (props) => {
  const todo = props.todo;
  const isParent = todo.isParent();
  const listOpen = props.listOpen;

  const [body, setBody] = useState(todo.message);
  const [hover, setHover] = useState(false);

  //this will need to be updated so there is one on the second span to type into the youngest descendent
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

  return (
    <div
      className={todoHeadStyles}
      style={{
        backgroundColor: props.color.toString(),
        color: props.color.negative().toString(),
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
          <h5 className={`${styles.label}`}>{listOpen ? body : todo.lineage.join(".")}</h5>
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
          isParent={isParent}
          onListToggle={props.onListToggle}
          todo={todo}
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
