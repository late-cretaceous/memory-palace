import React, { useState } from "react";
import TodoKit from "../../utilities/storage";
import TodoHead from "./TodoHead";
import TodoList from "./TodoList";
import PhantomTodo from "./PhantomTodo";
import styles from "./Todo.module.css";
import { Transition } from "react-transition-group";

const Todo = React.forwardRef((props, ref) => {
  const [todo, setTodos] = useState(props.todo);
  const [listOpen, setListOpen] = useState(false);
  const transitionTime = 200;

  const addChildHandler = (e, index) => {
    e.stopPropagation();
    console.log(`Top level index: ${index}`);
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
    console.log(`Bottom level index: ${index}`);
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

  const toggleListOpenHandler = () => {
    setListOpen(!listOpen);
  };

  const dragRef = props.provided && ref;
  const draggableProps = props.provided && { ...props.provided.draggableProps };
  const dragHandleProps = props.provided && props.provided.dragHandleProps;

  const todoHead = todo.parent && (
    <TodoHead
      todo={todo}
      onClose={props.onClose}
      onListToggle={toggleListOpenHandler}
      arrowOpen={listOpen}
      dragHandleProps={dragHandleProps}
      color={props.color}
      listOpen={listOpen}
      mouseEdgeEnterHandler={props.mouseEdgeEnterHandler}
      mouseEdgeLeaveHandler={props.mouseEdgeLeaveHandler}
    />
  );

  const listOpenCondition = listOpen || !todo.parent;

  const todoList = listOpenCondition && (
    <TodoList
      todos={todo.list}
      parent={todo}
      onAdd={addChildHandler}
      onMove={todoMoveHandler}
      onRemove={todoRemoveHandler}
      color={props.color}
      spectrumRange={props.spectrumRange}
      lightRange={props.lightRange}
    />
  );

  const transitionClass = {
    entering: "revealed",
    entered: "revealed",
    exiting: "collapsed",
    exited: "collapsed",
  };

  const todoAdder = todo.parent ? (
    <Transition
      in={todo.index + 1 === props.adderIndex}
      timeout={transitionTime}
      mountOnEnter
      unmountOnExit
    >
      {(state) => (
        <PhantomTodo
          index={todo.index}
          style={{
            backgroundColor: props.color.toString(),
            color: props.color.negative().toString(),
            transition: `all ${transitionTime}ms ease-out ${
              transitionTime / 4
            }ms`,
          }}
          className={transitionClass[state]}
          mouseEdgeLeaveHandler={props.mouseEdgeLeaveHandler}
          onAdd={adderClickedHandler}
        >
          +Todo
        </PhantomTodo>
      )}
    </Transition>
  ) : (
    <PhantomTodo
      index={-1}
      style={{
        backgroundColor: props.color.toString(),
        color: props.color.negative().toString(),
        transition: `all ${transitionTime}ms ease-out ${transitionTime / 4}ms`,
      }}
      mouseEdgeLeaveHandler={() => {return}}
      onAdd={addChildHandler}
    >
      +Todo
    </PhantomTodo>
  );

  let todoStyles = styles.todo;
  todoStyles += !todo.parent ? ` ${styles.bigTodo}` : "";

  return (
    <div className={todoStyles} ref={dragRef} {...draggableProps}>
      {todoHead}
      {todoList}
      {todoAdder}
    </div>
  );
});

export default Todo;
