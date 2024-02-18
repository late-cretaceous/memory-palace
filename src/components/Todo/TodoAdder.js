import styles from "./Todo.module.css";
import { useDispatch } from "react-redux";
import { editTransientTodo } from "../../redux/transientSlice";

const TodoAdder = ({ parent, ...props }) => {
  const classes = `${styles[props.className]} ${styles.todo} ${styles.adder}`;
  const dispatch = useDispatch();

  const mouseLeaveHandler = () => {
    if (props.className === "phantom") return;

    dispatch(
      editTransientTodo({ id: props.todoID, edit: { edgeActivated: false } })
    );
  };

  return (
    <div
      className={classes}
      onClick={() => {
        props.clickAddHandler(false);
      }}
      style={props.style}
      onMouseLeave={mouseLeaveHandler}
      data-name={props.mouseName}
    >
      {props.children}
    </div>
  );
};

export default TodoAdder;
