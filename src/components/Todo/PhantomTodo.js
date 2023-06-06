import styles from "./Todo.module.css";

const PhantomTodo = (props) => {
  return (
    <div className={`${styles.todo} ${styles.phantom}`} onClick={props.onAdd} style={props.style}>
      {props.text}
    </div>
  );
};

export default PhantomTodo;
