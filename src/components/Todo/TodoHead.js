import styles from "./TodoHead.module.css";
import TodoBottom from "./TodoBottom";
import Edgebox from "./Edgebox";
import TextArea from "../TextArea";
import { CSSTransition } from "react-transition-group";
import TodoTop from "./TodoTop";
import { useDispatch, useSelector } from "react-redux";
import { editTodo } from "../../redux/persistentSlice";
import { editTransientTodo } from "../../redux/transientSlice";
import HSL from "../../utilities/colors";

const TodoHead = ({ family: { todo, parent, siblings }, ...props }) => {
  const labelsVisible = useSelector((state) => state.labelSlice.visible);
  const dispatch = useDispatch();
  todo = useSelector((state) => state.persistentSlice[todo.id]) ?? todo;
  parent = useSelector((state) => state.persistentSlice[parent.id]);

  const transientTodos = useSelector((state) => state.transientSlice) ?? {};
  const cascadePhase = useSelector((state) => state.globalSlice.cascadePhase);

  const {
    listOpen,
    hover,
    inCascade,
    position,
    colorNegative,
    previousColorString,
  } = transientTodos[todo.id];

  console.log(`${position}: ${todo.message}`);

  const previousColor = HSL.fromString(previousColorString);

  const typeBodyHandler = (textInput) => {
    dispatch(editTodo({ id: todo.id, edit: { message: textInput } }));

    dispatch(editTransientTodo({ id: todo.id, edit: { isStarter: false } }));
  };

  const hoverHandler = (action) => {
    dispatch(editTransientTodo(action));
  };

  const todoHeadStyles = `${styles.todohead} ${
    listOpen ? styles.preview : styles.full
  }`;

  const labelDisplay = listOpen
    ? todo.message
    : labelsVisible
    ? todo.lineage.join(".")
    : "";

  const color = props.old
    ? previousColor
    : colorNegative
    ? props.color.negative()
    : props.color;
  const fontColor = color.negative();

  if (cascadePhase === "initialize" && !previousColor.isSameColor(color)){
    dispatch(
      editTransientTodo({
        id: todo.id,
        edit: { previousColorString: color.toString() },
      })
    );
  }

  const adderPosition = position > 0 ? position - 1 : 0;
  const previousTodo = Object.values(transientTodos).find(
    (transientTodo) => transientTodo.position === adderPosition
  ).id;

  return (
    <div
      className={todoHeadStyles}
      style={{
        backgroundColor: color,
        color: fontColor,
      }}
      id={todo.id}
      onMouseEnter={() => {
        hoverHandler({ id: todo.id, edit: { hover: true } });
      }}
      onMouseLeave={() => {
        hoverHandler({ id: todo.id, edit: { hover: false } });
      }}
    >
      {<Edgebox todoID={previousTodo} first={position === 0} />}
      <div
        className={styles.todoface}
        {...props.dragHandleProps}
        style={{ paddingLeft: `${1 + (todo.lineage.length - 1) * 2}rem` }}
      >
        <TodoTop
          hover={hover}
          labelDisplay={labelDisplay}
          family={{ todo, parent, siblings }}
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
            autofocus={!inCascade}
          />
        </CSSTransition>
        {props.old && <span> old</span>}
        <TodoBottom
          hover={hover}
          listOpen={listOpen}
          todo={todo}
          color={fontColor}
        />
      </div>
      {!listOpen && <Edgebox todoID={todo.id} first={false} />}
    </div>
  );
};

export default TodoHead;
