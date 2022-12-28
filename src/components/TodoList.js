import styles from "./TodoList.module.css";
import Todo from "./Todo";
import { useState } from "react";

const TodoList = () => {
  const [todos, setTodos] = useState([]);

  const todoComponentList = todos.map((todo) => <Todo id={todo} key={todo} />);

  const addTodoHandler = (e) => {
    setTodos((previous) => previous.concat([previous.length + 1]));
  };

  return (
    <div className={styles.flexcol} onClick={addTodoHandler}>
      <ul className={`${styles.flexcol} ${styles.list}`}>
        {todoComponentList}
      </ul>
    </div>
  );
};

export default TodoList;
