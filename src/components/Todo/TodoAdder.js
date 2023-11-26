import styles from "./Todo.module.css";
import { useDispatch, useSelector } from "react-redux";
import { addPersistentTodo } from "../../redux/persistentSlice";
import { addTransientTodo, toggleStarter } from "../../redux/transientSlice";

const TodoAdder = ({ todo, parent, ...props }) => {
  const siblings = useSelector((state) =>
    state.persistentSlice[parent.id].list.map((id) => state.persistentSlice[id])
  );
  const dispatch = useDispatch();
  const newSibling = parent.generateChild(todo.index + 1, siblings);
  const addChildHandler = () => {
    if (parent.list.length === 1) {
      dispatch(toggleStarter({ id: parent.list[0].id, value: false }));
    }

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
