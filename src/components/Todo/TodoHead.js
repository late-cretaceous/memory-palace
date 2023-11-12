import React, { useState } from "react";
import styles from "./TodoHead.module.css";
import TodoBottom from "./TodoBottom";
import Edgebox from "./Edgebox";
import TextArea from "../TextArea";
import { CSSTransition } from "react-transition-group";
import TodoTop from "./TodoTop";
import { useDispatch, useSelector } from "react-redux";
import { editTodo } from "../../redux/persistentSlice";

const TodoHead = (props) => {
  const [hover, setHover] = useState(false);
  const labelsVisible = useSelector((state) => state.labelSlice.visible);
  const dispatch = useDispatch();
  let todo = useSelector((state) => state.persistentSlice[props.todo.id]);
  if (!todo) {
    todo = props.todo;
  };

  const listOpen = props.listOpen;
  const typeBodyHandler = (textInput) => {
    dispatch(editTodo({ id: todo.id, edit: { message: textInput } }));
  };

  const todoHeadStyles = `${styles.todohead} ${
    listOpen ? styles.preview : styles.full
  }`;

  const labelDisplay = listOpen
    ? todo.message.length
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
        <TodoTop
          hover={hover}
          labelDisplay={labelDisplay}
          todo={todo}
          fontColor={fontColor}
        />
        <CSSTransition
          in={!listOpen}
          timeout={500}
          unmountOnExit
          classNames={{ ...styles }}
        >
          <TextArea
            text={todo.message}
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
          isStarter={props.isStarter}
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
