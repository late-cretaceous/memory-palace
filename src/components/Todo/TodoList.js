import styles from "./TodoList.module.css";
import Todo from "./Todo";
import PhantomTodo from "./PhantomTodo";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import Drop from "../../utilities/Drop";

const TodoList = (props) => {
  if (!props.todos.length && props.parent.id !== "bigTodo")
    return (
      <PhantomTodo
        text="Phantom Todo"
        onAdd={props.onAdd}
        style={{
          backgroundColor: props.color.toString(),
          color: props.color.negative().toString(),
        }}
      />
    );

  let recentMouseDown = false;

  const spectrum = props.color.shades(
    {
      hue: props.color.hue + props.spectrumRange,
      sat: props.color.sat,
      light: props.color.light + props.lightRange,
    },
    props.todos.length
  );

  console.log(spectrumLog(spectrum, props.spectrumRange, 0, props.lightRange));

  const todoComponentList = props.todos.map((todo, index) => {
    todo.pullChildren();

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
            spectrumRange={props.spectrumRange / props.todos.length}
            lightRange={props.lightRange / props.todos.length}
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
          </ul>
          <PhantomTodo
            text="Add Todo"
            onAdd={props.onAdd}
            style={{
              backgroundColor: props.color.toString(),
              color: props.color.negative().toString(),
            }}
          />
        </Drop>
      </DragDropContext>
    </div>
  );
};

const spectrumLog = (spectrum, hueStep, satStep, lightStep) => {
  const shades = Array.from(spectrum, (shade) => shade.toString());
  const increments = `\nIncrements\nhue: ${hueStep}\nsaturation: ${satStep}\nlight: ${lightStep}`;

  return shades.join("\n") + "\n" + increments;
};

export default TodoList;
