import React, { useState, useEffect } from "react";
import TodoKit from "../../utilities/storage";
import TodoHead from "./TodoHead";
import TodoList from "../newTodoList";

const Todo = React.forwardRef((props, ref) => {
  const todoKit = new TodoKit(props.todo);
  console.log("Big todo: " + props.bigTodo);
  console.log('TodoKit: ');
  console.log(todoKit);
  const [todos, setTodos] = useState(todoKit.list);
  console.log(todos);

  useEffect(() => {
    if (props.bigTodo) {
      console.log("retrieve all");
      todoKit.retrieveAll();
      setTodos(todoKit.list);
    }
  }, []);

  const todoAddHandler = () => {
    const todo = todoKit.add(todoKit);
    todoKit.store(todo);

    setTodos(todoKit.list);
  };

  const todoRemoveHandler = (e) => {
    todoKit.remove(e.target.id);

    localStorage.removeItem(e.target.id);

    setTodos(todoKit.list);
  };

  const todoMoveHandler = (e) => {
    if (!e.destination) return;

    todoKit.move(e.source.index, e.destination.index);
    todoKit.reorderStorage();

    setTodos(Array.from(todoKit.list));
  };

  const dragRequiredProps = props.provided
    ? {
        ref,
        ...props.provided.draggableProps,
        ...props.provided.dragHandleProps,
      }
    : {};

  const todoHead = props.id ? (
    <TodoHead message={props.todo.message} id={props.todo.id} onClose={props.onClose} />
  ) : null;

  return (
    <div {...dragRequiredProps}>
      {todoHead}
      <TodoList
        todos={todos}
        onAdd={todoAddHandler}
        onMove={todoMoveHandler}
        onRemove={todoRemoveHandler}
      />
    </div>
  );
});

export default Todo;
