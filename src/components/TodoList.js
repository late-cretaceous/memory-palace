import styles from './TodoList.module.css';
import Todo from "./Todo";

const TodoList = () => {
  return (
    <div className={styles.todolist}>
      <Todo />
      <Todo />
    </div>
  );
};

export default TodoList;
