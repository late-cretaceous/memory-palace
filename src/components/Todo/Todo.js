import { useRef, useEffect } from "react";
import TodoHead from "./TodoHead";
import TodoList from "./TodoList";
import TodoAdder from "./TodoAdder";
import styles from "./Todo.module.css";
import { Transition } from "react-transition-group";
import constants from "../constants.js";
import { useSelector, useDispatch } from "react-redux";
import { editTransientTodo, setCascade } from "../../redux/transientSlice";
import { addTodo } from "../../utilities/reduxUtils";

const Todo = ({ family, ...props }) => {
  const { todo, parent, siblings } = family;

  const {
    listOpen,
    hadStarter,
    edgeActivated,
    position,
    hasSortableChange,
    sortedAs,
  } = useSelector((state) => state.transientSlice[todo.id]);

  const sorted = sortedAs !== "manual";

  const animationCascade = useSelector(
    (state) => state.transientSlice["bigTodo"].cascade
  );

  const dispatch = useDispatch();
  const listRef = useRef(null);
  const timeoutId = useRef(null);

  const addChildHandler = (parent, siblings, isStarter = false) => {
    if (!isStarter && Boolean(siblings.length)) {
      dispatch(
        editTransientTodo({
          id: siblings[0].id,
          edit: { isStarter: false },
        })
      );
    }

    const newIndex =
      isStarter || edgeActivated.top
        ? 0
        : sorted
        ? siblings.length
        : todo.index + 1;

    const newPosition = isStarter || edgeActivated.top ? 0 : position + 1;

    const siblingList = isStarter ? [] : siblings;

    dispatch(addTodo(parent, siblingList, newIndex, newPosition, sortedAs));
  };

  const markAsNotNewHandler = () => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    if (hasSortableChange) {
      timeoutId.current = setTimeout(() => {
        dispatch(
          editTransientTodo({ id: todo.id, edit: { hasSortableChange: false } })
        );

        if (sorted) {
          dispatch(
            editTransientTodo({
              id: parent.id,
              edit: { singleSort: { id: todo.id, stage: "new" } },
            })
          );
        }
      }, 1000);
    }
  };

  const cancelNotNewHandler = () => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeoutId.current);
    };
  }, []);

  const listAnimationExitedHandler = () => {
    if (animationCascade.phase === "awaitingListClose") {
      dispatch(
        setCascade({
          id: "bigTodo",
          cascade: { ...animationCascade, phase: "initialized" },
        })
      );
    }
  };

  if (listOpen && !todo.list.length && !hadStarter) {
    addChildHandler(todo, siblings, true);
    dispatch(editTransientTodo({ id: todo.id, edit: { hadStarter: true } }));
  }

  const draggableProps = props.provided && { ...props.provided.draggableProps };
  const dragHandleProps = props.provided && props.provided.dragHandleProps;

  const todoHead = todo.parent && (
    <TodoHead
      family={{ todo, parent, siblings }}
      dragHandleProps={dragHandleProps}
      color={props.color}
      old={props.old}
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
    <Transition
      in={listOpen}
      timeout={500}
      unmountOnExit
      onExited={listAnimationExitedHandler}
    >
      {(state) => (
        <TodoList
          parent={todo}
          siblings={siblings}
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

  const todoAdderComponent = (transitionState) => (
    <TodoAdder
      {...adderProps}
      parent={parent}
      todoID={todo.id}
      siblings={siblings}
      className={adderTransitionClass[transitionState]}
      mouseName={"add"}
    >
      +Todo
    </TodoAdder>
  );

  const todoAdder = (
    <Transition
      in={edgeActivated.bottom}
      timeout={200}
      mountOnEnter
      unmountOnExit
    >
      {(state) => todoAdderComponent(state)}
    </Transition>
  );

  const firstTodoAdder = (
    <Transition in={edgeActivated.top} timeout={200} mountOnEnter unmountOnExit>
      {(state) => todoAdderComponent(state)}
    </Transition>
  );

  let todoStyles = styles.todo;
  todoStyles += !todo.parent ? ` ${styles.bigTodo}` : "";

  return (
    <div
      className={todoStyles}
      onMouseLeave={() => markAsNotNewHandler()}
      onMouseEnter={cancelNotNewHandler}
      {...draggableProps}
    >
      {firstTodoAdder}
      {todoHead}
      {todoList}
      {todoAdder}
    </div>
  );
};

export default Todo;
