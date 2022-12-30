import styles from "./TodoList.module.css";
import Todo from "./Todo";
import { useState } from "react";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [todoInTransit, setTodoInTransit] = useState(false);

  const dragStartHandler = (e) => {
    e.dataTransfer.setData("text/plain", e.target.id);
    e.dataTransfer.effectAllowed = "move";

    const todoIndex = todos.findIndex((todo) => todo.id === +e.target.id);

    todos[todoIndex].inTransit = true;
    setTodoInTransit(true);
  };

  const todoComponentList = todos.map((todo) => (
    <Todo
      id={todo.id}
      key={todo.id}
      onGrab={dragStartHandler}
      inTransit={todo.inTransit}
    />
  ));

  const addTodoHandler = (e) => {
    setTodos((previous) => {
      return previous.concat([
        { id: previous.length + 1, index: previous.length, inTransit: false },
      ]);
    });
  };

  console.log(todos);

  const dragOverHandler = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const dropHandler = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");

    setTodoInTransit(false);
    console.log(data);
  };

  return (
    <div className={styles.flexcol} onClick={addTodoHandler}>
      <ul
        className={`${styles.flexcol} ${styles.list}`}
        onDragOver={dragOverHandler}
        onDrop={dropHandler}
      >
        {todoComponentList}
      </ul>
    </div>
  );
};

export default TodoList;
