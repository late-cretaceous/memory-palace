import styles from "./TodoHead.module.css";
import TodoBottom from "./TodoBottom";
import Edgebox from "./Edgebox";
import TextArea from "../TextArea";
import { CSSTransition } from "react-transition-group";
import TodoTop from "./TodoTop";
import { useDispatch, useSelector } from "react-redux";
import { editTodo } from "../../redux/persistentSlice";
import { toggleHover, toggleStarter } from "../../redux/transientSlice";

const TodoHead = (props) => {
  const labelsVisible = useSelector((state) => state.labelSlice.visible);
  const dispatch = useDispatch();
  let todo = useSelector((state) => state.persistentSlice[props.todo.id]);
  if (!todo) {
    todo = props.todo;
  }

  const { listOpen, hover } =
    useSelector((state) => state.transientSlice[props.todo.id]) ?? {};

  const typeBodyHandler = (textInput) => {
    dispatch(editTodo({ id: todo.id, edit: { message: textInput } }));

    dispatch(toggleStarter({ id: todo.id, value: false }));
  };

  const hoverHandler = (action) => {
    dispatch(toggleHover(action));
  };

  const todoHeadStyles = `${styles.todohead} ${
    listOpen ? styles.preview : styles.full
  }`;

  const labelDisplay = listOpen
    ? todo.message
    : labelsVisible
    ? todo.lineage.join(".")
    : "";

  const fontColor = props.color.negative().toString();

  return (
    <div
      className={todoHeadStyles}
      style={{
        backgroundColor: props.color.toString(),
        color: fontColor,
      }}
      id={todo.id}
      onMouseEnter={() => {
        hoverHandler({ id: todo.id, hovering: true });
      }}
      onMouseLeave={() => {
        hoverHandler({ id: todo.id, hovering: false });
      }}
    >
      <Edgebox
        mouseEdgeEnterHandler={props.mouseEdgeEnterHandler}
        mouseEdgeLeaveHandler={props.mouseEdgeLeaveHandler}
        todoIndex={todo.index}
        top={true}
      />
      <div
        className={styles.todoface}
        {...props.dragHandleProps}
        style={{ paddingLeft: `${1 + (todo.lineage.length - 1) * 2}rem` }}
      >
        <TodoTop
          hover={hover}
          labelDisplay={labelDisplay}
          todo={todo}
          fontColor={fontColor}
        />
        <CSSTransition
          in={!listOpen}
          timeout={500}
          unmountOnExit
          classNames={{ ...styles }}
        >
          <TextArea
            text={todo.message}
            containerHover={hover}
            inputHandler={typeBodyHandler}
            placeholder={"Type a to-do"}
          />
        </CSSTransition>
        <TodoBottom
          hover={hover}
          listOpen={listOpen}
          todo={todo}
          color={fontColor}
        />
      </div>
      {!listOpen && (
        <Edgebox
          mouseEdgeEnterHandler={props.mouseEdgeEnterHandler}
          mouseEdgeLeaveHandler={props.mouseEdgeLeaveHandler}
          todoIndex={todo.index}
          top={false}
        />
      )}
    </div>
  );
};

export default TodoHead;
