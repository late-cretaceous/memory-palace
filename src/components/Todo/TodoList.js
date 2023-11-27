import styles from "./TodoList.module.css";
import idstyles from "./Todo.module.css";
import Todo from "./Todo";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { useState, forwardRef } from "react";
import Drop from "../../utilities/Drop";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useDispatch, useSelector } from "react-redux";
import { moveTodo } from "../../redux/persistentSlice";

const TodoList = forwardRef(({ parent, ...props }, ref) => {
  const [edgeOver, setEdgeOver] = useState(null);
  const [hadStarter, setHadStarter] = useState(false);

  const dispatch = useDispatch();

  const ids = useSelector((state) =>
    [...state.persistentSlice[parent.id].list]
  );

  const moveTodoHandler = (e) => {
    dispatch(moveTodo(e));
  };

  const lengthPlusOneForBackground = ids.length + 1;
  const spectrum = props.color.shades(
    {
      hue: props.color.hue + props.spectrumRange,
      sat: props.color.sat,
      light: props.color.light + props.lightRange,
    },
    lengthPlusOneForBackground
  );

  console.log(spectrumLog(spectrum, props.spectrumRange, 0, props.lightRange));

  const mouseEdgeEnterHandler = (e, index) => {
    setEdgeOver(index);
  };

  const mouseEdgeLeaveHandler = (e) => {
    setEdgeOver(null);
  };

  const todoComponentList = ids.map((id, index) => {
    return (
      <CSSTransition
        key={id}
        timeout={1000}
        classNames={{ ...idstyles }}
      >
        <Draggable key={id} draggableId={id} index={index}>
          {(provided) => (
            <div ref={provided.innerRef}>
              <Todo
                id={id}
                parent={parent}
                provided={provided}
                color={spectrum[index]}
                spectrumRange={(props.spectrumRange * 2) / ids.length}
                lightRange={(props.lightRange * 2) / ids.length}
                mouseEdgeEnterHandler={mouseEdgeEnterHandler}
                mouseEdgeLeaveHandler={mouseEdgeLeaveHandler}
                adderIndex={edgeOver}
                index={index}
              />
            </div>
          )}
        </Draggable>
      </CSSTransition>
    );
  });

  return (
    <div className={styles.flexcol} style={props.style} ref={ref}>
      <DragDropContext onDragEnd={moveTodoHandler}>
        <Drop id="todoDropArea">
          <ul className={`${styles.flexcol} ${styles.list}`}>
            <TransitionGroup component={null}>
              {todoComponentList}
            </TransitionGroup>
          </ul>
        </Drop>
      </DragDropContext>
    </div>
  );
});

const spectrumLog = (spectrum, hueStep, satStep, lightStep) => {
  const shades = Array.from(spectrum, (shade) => shade.toString());
  const increments = `\nIncrements\nhue: ${hueStep}\nsaturation: ${satStep}\nlight: ${lightStep}`;

  return shades.join("\n") + "\n" + increments;
};

export default TodoList;
