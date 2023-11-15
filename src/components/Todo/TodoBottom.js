import styles from "./TodoHead.module.css";
import { ReactComponent as Arrow } from "../../assets/triangle.svg";
import { useDispatch } from "react-redux";
import { toggleListOpen } from "../../redux/transientSlice";

const TodoBottom = (props) => {
  const dispatch = useDispatch();
  const arrowClickHandler = () => { dispatch(toggleListOpen(props.todo.id))};
  const classes = `${styles["todohead-row"]} ${styles["todo-bottom"]} ${
    props.hover ? styles.opaque : styles.transparent
  }`;
  console.log(props);

  return (
    <div className={classes}>
      {!props.isStarter && (
        <button
          className={`${styles.button} ${
            props.listOpen ? styles.arrowopen : ""
          }`}
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
