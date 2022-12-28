import styles from './TodoList.module.css';
import Todo from "./Todo";

const TodoList = () => {
  return (
    <div className={styles.flexcol}>
      <ul className={`${styles.flexcol} ${styles.list}`}>
        <Todo />
        <Todo />
      </ul>
    </div>

  );
};

export default TodoList;
