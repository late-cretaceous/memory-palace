import styles from "./Todo.module.css";
import Card from "./UI/Card";

const Todo = (props) => {
  return (
    <Card
      className={styles.todo}
      draggable="true"
      id={props.id}
      onDragStart={props.onGrab}
    >
      <h3>{props.id}</h3>
    </Card>
  );
};

export default Todo;
