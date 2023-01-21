import React, { useState, useEffect } from "react";
import TodoKit from "../../utilities/storage";
import TodoHead from "./TodoHead";
import TodoList from "../newTodoList";

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
    const newTodo = todo.add({
      id: todo.newNumber(),
      index: todo.list.length,
      parent: todo,
      message: "",
      list: [],
    });

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

  const todoHead = props.todo.id ? (
    <TodoHead
      message={props.todo.message}
      id={props.todo.id}
      onClose={props.onClose}
    />
  ) : null;

  return (
    <div {...dragRequiredProps}>
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
