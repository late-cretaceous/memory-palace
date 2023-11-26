import { useRef } from "react";
import TodoHead from "./TodoHead";
import TodoList from "./TodoList";
import TodoAdder from "./TodoAdder";
import styles from "./Todo.module.css";
import { Transition } from "react-transition-group";
import constants from "../constants.js";
import { useSelector } from "react-redux";
import { addPersistentTodo } from "../../redux/persistentSlice";
import { addTransientTodo } from "../../redux/transientSlice";
import { useDispatch } from "react-redux";

const Todo = ({ todo, ...props }) => {
  const listOpen = useSelector(
    (state) => state.transientSlice[todo.id]?.listOpen
  );
  
  const dispatch = useDispatch();
  const listRef = useRef(null);

  if (listOpen && !todo.list.length) {
    const newTodo = todo.generateChild();
    dispatch(addPersistentTodo(newTodo));
    dispatch(addTransientTodo({ id: newTodo.id, isStarter: true }));
  }

  const adderOpen = todo.index + 1 === props.adderIndex;

  const draggableProps = props.provided && { ...props.provided.draggableProps };
  const dragHandleProps = props.provided && props.provided.dragHandleProps;

  const todoHead = todo.parent && (
    <TodoHead
      todo={todo}
      dragHandleProps={dragHandleProps}
      color={props.color}
      mouseEdgeEnterHandler={props.mouseEdgeEnterHandler}
      mouseEdgeLeaveHandler={props.mouseEdgeLeaveHandler}
    />
  );

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
    <Transition in={listOpen} timeout={500} unmountOnExit>
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

  const todoAdder = (
    <Transition in={adderOpen} timeout={200} mountOnEnter unmountOnExit>
      {(state) => (
        <TodoAdder
          todo={todo}
          parent={props.parent}
          style={todoAdderInlineStyles}
          className={adderTransitionClass[state]}
          mouseEdgeLeaveHandler={props.mouseEdgeLeaveHandler}
          mouseName={"add"}
        >
          +Todo
        </TodoAdder>
      )}
    </Transition>
  );

  let todoStyles = styles.todo;
  todoStyles += !todo.parent ? ` ${styles.bigTodo}` : "";

  return (
    <div className={todoStyles} {...draggableProps}>
      {todoHead}
      {todoList}
      {todoAdder}
    </div>
  );
};

export default Todo;
