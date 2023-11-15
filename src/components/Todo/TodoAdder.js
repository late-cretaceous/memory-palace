import styles from "./Todo.module.css";
import { useDispatch } from "react-redux";
import { addPersistentTodo } from "../../redux/persistentSlice";
import { addTransientTodo } from "../../redux/transientSlice";

const TodoAdder = ({ todo, ...props }) => {
  const dispatch = useDispatch();
  const newSibling = todo.parent.generateChild(todo.index + 1);
  const addChildHandler = () => {
    dispatch(addPersistentTodo(newSibling));
    dispatch(addTransientTodo({ id: newSibling.id }));
  };
  const classes = `${styles[props.className]} ${styles.todo} ${styles.adder}`;

  return (
    <div
      className={classes}
      onClick={addChildHandler}
      style={props.style}
      onMouseLeave={props.mouseEdgeLeaveHandler}
      data-name={props.mouseName}
    >
      {props.children}
    </div>
  );
};

export default TodoAdder;
