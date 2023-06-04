import React, { useState } from "react";
import TodoKit from "../../utilities/storage";
import TodoHead from "./TodoHead";
import TodoList from "./TodoList";
import styles from "./Todo.module.css";

const Todo = React.forwardRef((props, ref) => {
  const [todo, setTodos] = useState(props.todo);
  const [listOpen, setListOpen] = useState(false);

  const todoAddHandler = (e) => {
    e.stopPropagation();
    const lineage = todo.lineage.concat(todo.newNumber());

    const childTodo = new TodoKit({
      id: Date.now().toString(),
      lineage: lineage,
      index: todo.list.length,
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
    />
  );

  const listOpenCondition = listOpen || !todo.parent;

  const todoList = listOpenCondition && (
    <TodoList
      todos={todo.list}
      parent={todo}
      onAdd={todoAddHandler}
      onMove={todoMoveHandler}
      onRemove={todoRemoveHandler}
      color={props.color}
      spectrumRange={props.spectrumRange}
      lightRange={props.lightRange}
    />
  );

  //Below conditional is temporary pending collapsable lists
  const todoStyles = todo.parent
    ? styles.todo
    : `${styles.todo} ${styles.bigTodo}`;

  return (
    <div className={todoStyles} ref={dragRef} {...draggableProps}>
      {todoHead}
      {todoList}
      <div className={styles.gap} index={todo.index + 1} onMouseEnter={props.onHover} onMouseLeave={props.onHover}></div>
    </div>
  );
});

export default Todo;
