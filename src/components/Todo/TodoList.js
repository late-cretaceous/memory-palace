import styles from "./TodoList.module.css";
import Todo from "./Todo";
import PhantomTodo from "./PhantomTodo";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import Drop from "../../utilities/Drop";
import HSL from "../../utilities/colors";

const TodoList = (props) => {
  if (!props.todos.length && props.parent.id !== "bigTodo")
    return <PhantomTodo text="Phantom Todo" onAdd={props.onAdd} />;

  let recentMouseDown = false;

  const spectrum = props.color.shades(
    new HSL(props.color.hue + 120, props.color.sat, props.color.light),
    props.todos.length
  );

  console.log(spectrum);

  const todoComponentList = props.todos.map((todo, index) => {
    return (
      <Draggable key={todo.id} draggableId={todo.id} index={index}>
        {(provided) => (
          <Todo
            todo={todo}
            parent={props.parent}
            ref={provided.innerRef}
            provided={provided}
            onClose={props.onRemove}
            color={spectrum[index]}
          />
        )}
      </Draggable>
    );
  });

  const allowAddHandler = (e) => {
    recentMouseDown = true;

    setTimeout(() => {
      recentMouseDown = false;
    }, 250);
  };

  const todoAddHandler = (e) => {
    if (!recentMouseDown) return;
    props.onAdd(e);
  };

  return (
    <div
      className={styles.flexcol}
      onClick={todoAddHandler}
      onMouseDown={allowAddHandler}
    >
      <DragDropContext onDragEnd={props.onMove}>
        <Drop id="todoDropArea">
          <ul className={`${styles.flexcol} ${styles.list}`}>
            {todoComponentList}
            <PhantomTodo text="Add Todo" onAdd={props.onAdd} />
          </ul>
        </Drop>
      </DragDropContext>
    </div>
  );
};

export default TodoList;
