import React, { useState, useEffect } from "react";
import TodoKit from "../../utilities/storage";
import TodoHead from "./TodoHead";
import TodoList from "../newTodoList";
import styles from "./Todo.module.css";

const Todo = React.forwardRef((props, ref) => {
  const [todo, setTodos] = useState(new TodoKit(props.todo));
  console.log(todo);

  useEffect(() => {
    if (props.bigTodo) {
      const newTodo = new TodoKit(props.todo);
      newTodo.retrieveAll();
      console.log("retrieve all");

      setTodos(newTodo);
    }
  }, []);

  const todoAddHandler = () => {
    const newTodo = todo.add({
      id: todo.newNumber(todo).toString(),
      index: todo.list.length,
      parent: todo.id,
      message: "",
      list: [],
    });

    console.log(newTodo);

    todo.store(newTodo);

    setTodos(new TodoKit(todo));
  };

  const todoRemoveHandler = (e) => {
    todo.remove(e.target.id);

    localStorage.removeItem(e.target.id);

    setTodos(new TodoKit(todo));
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
