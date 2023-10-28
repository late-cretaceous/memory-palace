import styles from "./TodoList.module.css";
import todoStyles from "./Todo.module.css";
import Todo from "./Todo";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { useState, forwardRef } from "react";
import PhantomTodo from "./PhantomTodo";
import Drop from "../../utilities/Drop";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useSelector } from "react-redux";
import makeSelectTodoList from "../../redux/selectors";

const TodoList = forwardRef(({ todos, ...props }, ref) => {
  const [edgeOver, setEdgeOver] = useState(null);
  const [hadStarter, setHadStarter] = useState(false);

const todoList = useSelector(makeSelectTodoList(props.parent.id));
console.log("TodoList selected slice:")
console.log(todoList);

  const changeStarterTodoHandler = () => {
    setHadStarter(false);
  };

  if (!todos.length && !hadStarter) {
    props.onAdd(null, 0);
    setHadStarter(true);
    return;
  }

  const clickAddHandler = (e, index) => {
    e.stopPropagation();
    setEdgeOver(null);
    props.onAdd(e, index);
  };

  const lengthPlusOneForBackground = todos.length + 1;
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

  const todoComponentList = todos.length ? (
    todos.map((todo, index) => {
      todo.pullChildren();
      return (
        <CSSTransition
          key={todo.id}
          timeout={1000}
          classNames={{ ...todoStyles }}
        >
          <Draggable key={todo.id} draggableId={todo.id} index={index}>
            {(provided) => (
              <div ref={provided.innerRef}>
                <Todo
                  todo={todo}
                  parent={props.parent}
                  provided={provided}
                  onClose={props.onRemove}
                  color={spectrum[index]}
                  spectrumRange={(props.spectrumRange * 2) / todos.length}
                  lightRange={(props.lightRange * 2) / todos.length}
                  mouseEdgeEnterHandler={mouseEdgeEnterHandler}
                  mouseEdgeLeaveHandler={mouseEdgeLeaveHandler}
                  adderIndex={edgeOver}
                  index={index}
                  onAdd={clickAddHandler}
                  onStarterChange={changeStarterTodoHandler}
                  isStarter={hadStarter}
                />
              </div>
            )}
          </Draggable>
        </CSSTransition>
      );
    })
  ) : (
    <CSSTransition
      key={"phantom"}
      timeout={1000}
      classNames={{ ...todoStyles }}
    >
      <PhantomTodo
        parent={props.parent}
        color={props.color}
        onAdd={clickAddHandler}
      />
    </CSSTransition>
  );

  return (
    <div className={styles.flexcol} style={props.style} ref={ref}>
      <DragDropContext onDragEnd={props.onMove}>
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
