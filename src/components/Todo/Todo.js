import { useState, useRef } from "react";
import TodoHead from "./TodoHead";
import TodoList from "./TodoList";
import TodoAdder from "./TodoAdder";
import styles from "./Todo.module.css";
import { Transition } from "react-transition-group";
import constants from "../constants.js";
import { useSelector } from "react-redux";

const Todo = ({todo, ...props}) => {
  const [listOpen, setListOpen] = useState(todo.isBigTodo() ? true : false);
  const open = useSelector(state => state.transientSlice[todo.id]?.listOpen);
  console.log(open);

  const listRef = useRef(null);
  const adderOpen = todo.index + 1 === props.adderIndex;
  const isPhantom = todo.id === "phantom";

  const draggableProps = props.provided && { ...props.provided.draggableProps };
  const dragHandleProps = props.provided && props.provided.dragHandleProps;

  const listToggleHandler = () => {
    todo.empties().forEach((empty) => {
      todo.remove(empty.id);
      localStorage.removeItem(empty.id);
    });

    setListOpen((prev) => !prev);
  };

  const todoHead = !isPhantom && todo.parent && (
    <TodoHead
      todo={todo}
      onListToggle={listToggleHandler}
      listOpen={listOpen}
      dragHandleProps={dragHandleProps}
      color={props.color}
      mouseEdgeEnterHandler={props.mouseEdgeEnterHandler}
      mouseEdgeLeaveHandler={props.mouseEdgeLeaveHandler}
      isStarter={props.isStarter}
      onStarterChange={props.onStarterChange}
    />
  );

  const listOpenConditions = !isPhantom && (listOpen || !todo.parent);

  const listEnteringHeight = todo.list.length
    ? todo.list.length * constants.TODO_HEIGHT_PX
    : constants.ADDER_HEIGHT_PX;

  const listEnteredHeight = listOpen
    ? "auto"
    : listRef.current
    ? `${listRef.current.offsetHeight}px`
    : null;

  const listTransition = {
    entering: { height: `${listEnteringHeight}px`, overflow: "hidden" },
    entered: { height: listEnteredHeight },
    exiting: { height: 0, overflow: "hidden" },
    exited: { height: 0, overflow: "hidden" },
  };

  const listColor = todo.parent
    ? props.color.adjustedHSL(20, 0, 2)
    : props.color;

  const todoList = (
    <Transition in={listOpenConditions} timeout={500} unmountOnExit>
      {(state) => (
        <TodoList
          parent={todo}
          color={listColor}
          spectrumRange={props.spectrumRange}
          lightRange={props.lightRange}
          style={{
            ...listTransition[state],
            transition: `all ${500}ms ease-in-out`,
          }}
          ref={listRef}
        />
      )}
    </Transition>
  );
  const adderTransitionClass = {
    entering: "adder-entering",
    entered: "adder-entered",
    exiting: "adder-exiting",
    exited: "adder-exited",
  };

  const todoAdderInlineStyles = {
    backgroundColor: props.color.adjustedHSL(0, 0, 5).toString(),
    color: props.color.negative().adjustedHSL(0, 0, 5).toString(),
    transition: `all 200ms ease-out`,
  };

  const todoAdder = !isPhantom ? (
    <Transition in={adderOpen} timeout={200} mountOnEnter unmountOnExit>
      {(state) => (
        <TodoAdder
          todo={todo}
          style={todoAdderInlineStyles}
          className={adderTransitionClass[state]}
          mouseEdgeLeaveHandler={props.mouseEdgeLeaveHandler}
          mouseName={"add"}
        >
          +Todo
        </TodoAdder>
      )}
    </Transition>
  ) : (
    <TodoAdder
      index={-1}
      style={todoAdderInlineStyles}
      mouseEdgeLeaveHandler={() => {
        return;
      }}
      mouseName={"phantom"}
    >
      +Todo
    </TodoAdder>
  );

  let todoStyles = styles.todo;
  todoStyles += !todo.parent ? ` ${styles.bigTodo}` : "";
  todoStyles += isPhantom ? ` ${styles.phantom}` : "";

  return (
    <div className={todoStyles} {...draggableProps}>
      {todoHead}
      {todoList}
      {todoAdder}
    </div>
  );
};

export default Todo;