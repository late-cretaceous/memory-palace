import React, { useState, useEffect } from "react";
import TodoKit from "../../utilities/storage";
import TodoHead from "./TodoHead";
import TodoList from "../newTodoList";
import styles from "./Todo.module.css";

const Todo = React.forwardRef((props, ref) => {
  const [todo, setTodos] = useState(new TodoKit(props.todo));

  useEffect(() => {
    if (props.bigTodo) {
      const newTodo = new TodoKit(props.todo);
      newTodo.retrieveAll();
      console.log("retrieve all");

      setTodos(newTodo);
    }
  }, []);

  const todoAddHandler = () => {
    const newTodo = new TodoKit(todo);

    newTodo.add({
      id: Date.now().toString(),
      label: todo.newNumber(todo).toString(),
      index: todo.list.length,
      parent: todo.id,
      message: "",
      list: [],
    });

    todo.store(newTodo);

    setTodos(newTodo);
  };

  const todoRemoveHandler = (e) => {
    const todoCopy = new TodoKit(todo);

    todoCopy.remove(e.target.id);

    todo.store(todoCopy);

    setTodos(todoCopy);
  };

  const todoMoveHandler = (e) => {
    if (!e.destination) return;

    todo.move(e.source.index, e.destination.index);
    todo.reorderStorage();

    setTodos(new TodoKit(todo));
  };

  const dragRequiredProps = props.provided
    ? {
        ref,
        ...props.provided.draggableProps,
        ...props.provided.dragHandleProps,
      }
    : {};

  const todoHead = todo.parent ? (
    <TodoHead
      message={props.todo.message}
      id={props.todo.id}
      label={props.todo.label}
      onClose={props.onClose}
    />
  ) : null;

  return (
    //Below conditional is temporary pending collapsable lists
    <div className={todo.parent ? "" : styles.flexcol} {...dragRequiredProps}>
      {todoHead}
      <TodoList
        todos={todo.list}
        onAdd={todoAddHandler}
        onMove={todoMoveHandler}
        onRemove={todoRemoveHandler}
      />
    </div>
  );
});

export default Todo;
