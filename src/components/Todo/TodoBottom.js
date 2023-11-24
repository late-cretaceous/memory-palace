import styles from "./TodoHead.module.css";
import { ReactComponent as Arrow } from "../../assets/triangle.svg";
import { useDispatch } from "react-redux";
import { toggleListOpen } from "../../redux/transientSlice";
import { removeTodo } from "../../utilities/reduxUtils";
import { useSelector } from "react-redux";

const TodoBottom = (props) => {
  const dispatch = useDispatch();
  const arrowClickHandler = () => {
    dispatch(toggleListOpen(props.todo.id));

    props.todo.empties().forEach((empty) => {
      dispatch(removeTodo(empty));
    });
  };

  const { listOpen, isStarter } = useSelector(
    (state) => state.transientSlice[props.todo.id] ?? []
  );

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
                fill: props.todo.isParent() ? props.color : "none",
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
