import { useState } from "react";
import TodoKit from "../../utilities/storage";
import TodoHead from "./TodoHead";
import TodoList from "./TodoList";
import TodoAdder from "./TodoAdder";
import styles from "./Todo.module.css";
import { Transition } from "react-transition-group";
import constants from "../constants.js";

const Todo = (props) => {
  const [todo, setTodos] = useState(props.todo);
  const [listOpen, setListOpen] = useState(false);

  const adderOpen = todo.index + 1 === props.adderIndex;
  const transitionTime = 200;
  const isPhantom = props.todo.id === "phantom";

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

  const resizedChildHandler = (adjustment) => {};

  const draggableProps = props.provided && { ...props.provided.draggableProps };
  const dragHandleProps = props.provided && props.provided.dragHandleProps;

  const todoHead = !isPhantom && todo.parent && (
    <TodoHead
      todo={todo}
      onClose={props.onClose}
      onListToggle={() => setListOpen(!listOpen)}
      listOpen={listOpen}
      dragHandleProps={dragHandleProps}
      color={props.color}
      mouseEdgeEnterHandler={props.mouseEdgeEnterHandler}
      mouseEdgeLeaveHandler={props.mouseEdgeLeaveHandler}
    />
  );

  const listOpenConditions = !isPhantom && (listOpen || !todo.parent);

  const listHeight = todo.isBigTodo()
    ? "auto"
    : todo.list.length
    ? todo.list.length * constants.TODO_HEIGHT_PX
    : constants.ADDER_HEIGHT_PX;

  const listTransition = {
    entering: { height: `${listHeight}px`, overflow: "hidden" },
    entered: { height: `${listHeight}px` },
    exiting: { height: 0, overflow: "hidden" },
    exited: { height: 0, overflow: "hidden" },
  };

  const enterFunc = (node) => {
    node.style.height = "auto";
  };

  const todoList = (
    <Transition
      in={listOpenConditions}
      timeout={500}
      unmountOnExit
      onEntered={enterFunc}
    >
      {(state) => (
        <TodoList
          todos={todo.list}
          parent={todo}
          onAdd={addChildHandler}
          onMove={todoMoveHandler}
          onRemove={todoRemoveHandler}
          onResizedChild={resizedChildHandler}
          color={props.color}
          spectrumRange={props.spectrumRange}
          lightRange={props.lightRange}
          style={{
            ...listTransition[state],
            transition: `all ${500}ms ease-in-out`,
          }}
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
    transition: `all ${transitionTime}ms ease-out`,
  };

  const todoAdder = !isPhantom ? (
    <Transition
      in={adderOpen}
      timeout={transitionTime}
      mountOnEnter
      unmountOnExit
    >
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
