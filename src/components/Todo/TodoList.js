import styles from "./TodoList.module.css";
import todoStyles from "./Todo.module.css";
import Todo from "./Todo";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { useState, forwardRef } from "react";
import PhantomTodo from "./PhantomTodo";
import Drop from "../../utilities/Drop";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useDispatch, useSelector } from "react-redux";
import { addPersistentTodo, moveTodo } from "../../redux/persistentSlice";
import { addTransientTodo } from "../../redux/transientSlice";
import { logChildrenInOrder } from "../../utilities/loggers";

const TodoList = forwardRef(({ parent, ...props }, ref) => {
  const [edgeOver, setEdgeOver] = useState(null);
  const [hadStarter, setHadStarter] = useState(false);

  const dispatch = useDispatch();

  const todos = useSelector((state) => state.persistentSlice[parent.id].list);

  //scaffold for console logs
  const persistentSlice = useSelector((state) => state.persistentSlice);
  console.log("Persistent slice:");
  logChildrenInOrder(persistentSlice);

  console.log(`${parent.id} list slice:`);
  logChildrenInOrder(todos);
  //scaffold end
  
  const changeStarterTodoHandler = () => {
    setHadStarter(false);
  };

  if (!todos.length && !hadStarter) {
    const newTodo = parent.generateChild();
    dispatch(addPersistentTodo(newTodo));
    dispatch(addTransientTodo({ id: newTodo.id}));

    setHadStarter(true);
    return;
  } else if (todos.length > 1 && hadStarter) {
    changeStarterTodoHandler();
  }

  const moveTodoHandler = (e) => {
    dispatch(moveTodo(e));
  }

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
                  parent={parent}
                  provided={provided}
                  color={spectrum[index]}
                  spectrumRange={(props.spectrumRange * 2) / todos.length}
                  lightRange={(props.lightRange * 2) / todos.length}
                  mouseEdgeEnterHandler={mouseEdgeEnterHandler}
                  mouseEdgeLeaveHandler={mouseEdgeLeaveHandler}
                  adderIndex={edgeOver}
                  index={index}
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
      <PhantomTodo parent={parent} color={props.color} />
    </CSSTransition>
  );

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
