import { useRef } from "react";
import TodoHead from "./TodoHead";
import TodoList from "./TodoList";
import TodoAdder from "./TodoAdder";
import styles from "./Todo.module.css";
import { Transition } from "react-transition-group";
import constants from "../constants.js";
import { useSelector } from "react-redux";
import { addPersistentTodo } from "../../redux/persistentSlice";
import {
  addTransientTodo,
  editTransientTodo,
} from "../../redux/transientSlice";
import { useDispatch } from "react-redux";
import { generateChild } from "../../utilities/todoUtils";

const Todo = ({ family: { todo, parent, siblings }, ...props }) => {
  const { listOpen, hadStarter, edgeActivated } = useSelector(
    (state) => state.transientSlice[todo.id]
  );

  const dispatch = useDispatch();
  const listRef = useRef(null);

  const addChildHandler = (parent, isStarter = false) => {
    const index = isStarter ? 0 : todo.index + 1;
    siblings = isStarter ? [] : siblings;
    const newSibling = generateChild(parent, siblings, index);

    if (!isStarter) {
      dispatch(
        editTransientTodo({
          id: props.siblings[0].id,
          edit: { isStarter: false },
        })
      );
    }

    dispatch(addPersistentTodo(newSibling));
    dispatch(
      addTransientTodo({ id: newSibling.id, isStarter, position: index })
    );
  };

  if (listOpen && !todo.list.length && !hadStarter) {
    addChildHandler(todo, true);
    dispatch(editTransientTodo({ id: todo.id, edit: { hadStarter: true } }));
  }

  const draggableProps = props.provided && { ...props.provided.draggableProps };
  const dragHandleProps = props.provided && props.provided.dragHandleProps;

  const todoHead = todo.parent && (
    <TodoHead
      family={{ todo, parent, siblings }}
      dragHandleProps={dragHandleProps}
      color={props.color}
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

  const todoAdderInlineStyles = {
    backgroundColor: props.color.adjustedHSL(0, 0, 5).toString(),
    color: props.color.negative().adjustedHSL(0, 0, 5).toString(),
    transition: `all 200ms ease-out`,
  };

  const adderProps = {
    style: todoAdderInlineStyles,
    clickAddHandler: addChildHandler,
  };

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
          emptyListAdderProps={adderProps}
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

  const todoAdder = (
    <Transition in={edgeActivated} timeout={200} mountOnEnter unmountOnExit>
      {(state) => (
        <TodoAdder
          {...adderProps}
          parent={props.parent}
          todoID={todo.id}
          className={adderTransitionClass[state]}
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
