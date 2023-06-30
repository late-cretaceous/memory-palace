import styles from "./TodoList.module.css";
import Todo from "./Todo";
import PhantomTodo from "./PhantomTodo";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { useState } from "react";
import Drop from "../../utilities/Drop";
import { CSSTransition, TransitionGroup } from "react-transition-group";

const TodoList = (props) => {
  const [edgeOver, setEdgeOver] = useState(null);

  const clickAddHandler = (e, index) => {
    console.log(index);
    setEdgeOver(null);
    props.onAdd(e, index);
  };

  if (!props.todos.length && props.parent.id !== "bigTodo")
    return (
      <PhantomTodo
        text="Phantom Todo"
        onAdd={clickAddHandler}
        style={{
          backgroundColor: props.color.toString(),
          color: props.color.negative().toString(),
        }}
      />
    );

  const spectrum = props.color.shades(
    {
      hue: props.color.hue + props.spectrumRange,
      sat: props.color.sat,
      light: props.color.light + props.lightRange,
    },
    props.todos.length
  );

  console.log(spectrumLog(spectrum, props.spectrumRange, 0, props.lightRange));

  const mouseEdgeEnterHandler = (e, index) => {
    setEdgeOver(index);
  };

  const mouseEdgeLeaveHandler = (e) => {
    const mouseTo = e.relatedTarget.dataset
      ? e.relatedTarget.dataset.name
      : null;

    if (mouseTo !== "add" && mouseTo !== "edgebox") {
      setEdgeOver(null);
    }
  };


  const todoComponentList = props.todos.map((todo, index) => {
    todo.pullChildren();
    return (
      <CSSTransition key={todo.id} timeout={2000} classNames={{...styles}} >
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
              mouseEdgeEnterHandler={mouseEdgeEnterHandler}
              mouseEdgeLeaveHandler={mouseEdgeLeaveHandler}
              adderIndex={edgeOver}
              index={index}
              onAdd={clickAddHandler}
            />
          )}
        </Draggable>
      </CSSTransition>
    );
  });


  return (
    <div
      className={styles.flexcol}
    >
      <DragDropContext onDragEnd={props.onMove}>
        <Drop id="todoDropArea">
          <ul className={`${styles.flexcol} ${styles.list}`}>
            <TransitionGroup>{todoComponentList}</TransitionGroup>
          </ul>
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
