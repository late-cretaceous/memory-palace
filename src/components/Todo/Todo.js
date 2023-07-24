import { useState, useRef, useEffect } from "react";
import TodoKit from "../../utilities/storage";
import TodoHead from "./TodoHead";
import TodoList from "./TodoList";
import TodoAdder from "./TodoAdder";
import styles from "./Todo.module.css";
import { Transition } from "react-transition-group";
import constants from "../constants.js";

const Todo = (props) => {
  const [todo, setTodos] = useState(props.todo);
  const [listOpen, setListOpen] = useState(todo.isBigTodo() ? "opened" : null);
  const listRef = useRef(null);

  const adderOpen = todo.index + 1 === props.adderIndex;
  const isPhantom = props.todo.id === "phantom";

  console.log(`${todo.id}: ${listOpen}`);

  const addChildHandler = (e, index) => {
    e.stopPropagation();
    const lineage = todo.lineage.concat(todo.newNumber());

    const childTodo = new TodoKit({
      id: Date.now().toString(),
      lineage: lineage,
      index: index,
      parent: todo,
      message: "",
      list: [],
      listLoaded: true,
    });

    todo.add(childTodo);

    todo.store();
    childTodo.store();

    setTodos(new TodoKit(todo));
  };

  const adderClickedHandler = (e, index) => {
    props.onAdd(e, index);
  };

  const todoRemoveHandler = (e) => {
    const todoCopy = new TodoKit(todo);

    todoCopy.remove(e.target.id);

    todoCopy.store();
    localStorage.removeItem(e.target.id);

    setTodos(todoCopy);
  };

  const todoMoveHandler = (e) => {
    if (!e.destination) return;

    todo.move(e.source.index, e.destination.index);
    todo.reorderStorage();

    setTodos(new TodoKit(todo));
  };

  const draggableProps = props.provided && { ...props.provided.draggableProps };
  const dragHandleProps = props.provided && props.provided.dragHandleProps;

  const listToggleHandler = () => {
    if (!listOpen) {
      setListOpen("opening");
    } else {
      setListOpen(null);
    }
  };

  const todoHead = !isPhantom && todo.parent && (
    <TodoHead
      todo={todo}
      onClose={props.onClose}
      onListToggle={listToggleHandler}
      listOpen={listOpen}
      dragHandleProps={dragHandleProps}
      color={props.color}
      mouseEdgeEnterHandler={props.mouseEdgeEnterHandler}
      mouseEdgeLeaveHandler={props.mouseEdgeLeaveHandler}
    />
  );

  const listOpenConditions = !isPhantom && (Boolean(listOpen) || !todo.parent);

  const listAnimationHeight = todo.list.length
    ? todo.list.length * constants.TODO_HEIGHT_PX
    : constants.ADDER_HEIGHT_PX;

  const listEnteredHeight =
    listOpen === "opened" ? "auto" : `${listAnimationHeight}px`;

  const listTransition = {
    entering: { height: `${listAnimationHeight}px`, overflow: "hidden" },
    entered: { height: listEnteredHeight },
    exiting: { height: 0, overflow: "hidden" },
    exited: { height: 0, overflow: "hidden" },
  };

  const listEnteredHandler = () => {
    setListOpen("opened");
  };

  const listExitHandler = (node) => {
    console.log(`List height from offset: ${listRef.current.offsetHeight}`);

    node.style.height = `${listAnimationHeight}px`;
  };

  const todoList = (
    <Transition
      in={listOpenConditions}
      timeout={500}
      unmountOnExit
      onEntered={listEnteredHandler}
      onExit={listExitHandler}
    >
      {(state) => (
        <TodoList
          todos={todo.list}
          parent={todo}
          onAdd={addChildHandler}
          onMove={todoMoveHandler}
          onRemove={todoRemoveHandler}
          color={props.color}
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
    backgroundColor: props.color.adjustedHCL(0, 0, 5).toString(),
    color: props.color.negative().adjustedHCL(0, 0, 5).toString(),
    transition: `all 200ms ease-out`,
  };

  const todoAdder = !isPhantom ? (
    <Transition in={adderOpen} timeout={200} mountOnEnter unmountOnExit>
      {(state) => (
        <TodoAdder
          index={todo.index}
          style={todoAdderInlineStyles}
          className={adderTransitionClass[state]}
          mouseEdgeLeaveHandler={props.mouseEdgeLeaveHandler}
          onAdd={adderClickedHandler}
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
      onAdd={adderClickedHandler}
      mouseName={"phantom"}
    >
      Phantom
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
