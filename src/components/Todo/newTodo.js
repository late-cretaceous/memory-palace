import React, { useState, useEffect } from "react";
import TodoKit from "../../utilities/storage";
import TodoHead from "./TodoHead";
import TodoList from "../newTodoList";
import styles from "./Todo.module.css";

const Todo = React.forwardRef((props, ref) => {
  const [todo, setTodos] = useState(new TodoKit(props.todo));

  useEffect(() => {
    if (props.bigTodo) {
      if (!localStorage.getItem("bigTodo")) {
        todo.store();
        return;
      }

      const newTodo = new TodoKit(todo.pull("bigTodo"));
      newTodo.pullDescendents();

      setTodos(newTodo);
    }
  }, []);

  const todoAddHandler = () => {
    const thisTodo = new TodoKit(todo);

    const childTodo = new TodoKit({
      id: Date.now().toString(),
      label: todo.newNumber(),
      index: todo.list.length,
      parent: todo.id,
      message: "",
      list: [],
    });

    thisTodo.add(childTodo);

    thisTodo.store();
    childTodo.store();

    setTodos(thisTodo);
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
