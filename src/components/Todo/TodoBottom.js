import styles from "./TodoHead.module.css";
import { ReactComponent as Arrow } from "../../assets/triangle.svg";
import { useDispatch } from "react-redux";
import { toggleListOpen, editTransientTodo } from "../../redux/transientSlice";
import { useSelector } from "react-redux";

const TodoBottom = (props) => {
  const dispatch = useDispatch();
  const arrowClickHandler = () => {
    dispatch(toggleListOpen(props.todo.id));
    dispatch(
      editTransientTodo({ id: props.todo.id, edit: { hadStarter: false } })
    );
  };

  const { listOpen, isStarter } = useSelector((state) => {
    const todoSlice = state.transientSlice[props.todo.id];
    return {
      listOpen: todoSlice?.listOpen,
      isStarter: todoSlice?.isStarter,
    };
  });

  const classes = `${styles["todohead-row"]} ${styles["todo-bottom"]} ${
    props.hover ? styles.opaque : styles.transparent
  }`;

  return (
    <div className={classes}>
      {!isStarter && (
        <button
          className={`${styles.button} ${listOpen ? styles.arrowopen : ""}`}
          onClick={arrowClickHandler}
        >
          <span>
            <Arrow
              style={{
                fill: props.todo.list.length ? props.color : "none",
                stroke: props.color,
                strokeWidth: "1.5px",
              }}
            />
          </span>
        </button>
      )}
    </div>
  );
};

export default TodoBottom;
