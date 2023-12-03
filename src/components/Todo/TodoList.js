import styles from "./TodoList.module.css";
import todoStyles from "./Todo.module.css";
import Todo from "./Todo";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { useState, forwardRef } from "react";
import Drop from "../../utilities/Drop";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useDispatch, useSelector } from "react-redux";
import { moveTodo, addExistingTodo } from "../../redux/persistentSlice";
import { fetchTodo } from "../../utilities/databaseUtils";
import {
  addTransientTodo,
  editTransientTodo,
} from "../../redux/transientSlice";
import TodoAdder from "./TodoAdder";

const TodoList = forwardRef(({ parent, ...props }, ref) => {
  const [edgeOver, setEdgeOver] = useState(null);

  const dispatch = useDispatch();

  const listPulled = useSelector(
    (state) => state.transientSlice[parent.id].listPulled
  );

  if (!listPulled) {
    parent.list.forEach((id) => {
      dispatch(addExistingTodo(fetchTodo(id)));
      dispatch(addTransientTodo({ id }));
      dispatch(
        editTransientTodo({ id: parent.id, edit: { listPulled: true } })
      );
    });
  }

  const todos = useSelector((state) => {
    return state.persistentSlice[parent.id]
      ? state.persistentSlice[parent.id].list.map(
          (id) => state.persistentSlice[id]
        )
      : [];
  });

  const moveTodoHandler = (e) => {
    dispatch(moveTodo(e));
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
                  siblings={todos}
                  provided={provided}
                  color={spectrum[index]}
                  spectrumRange={(props.spectrumRange * 2) / todos.length}
                  lightRange={(props.lightRange * 2) / todos.length}
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
    })
  ) : (
    <CSSTransition
      key={"phantom"}
      timeout={1000}
      classNames={{ ...todoStyles }}
    >
      <TodoAdder
        {...props.emptyListAdderProps}
        parent={parent}
        color={props.color}
        className={"phantom"}
        mouseEdgeLeaveHandler={() => {
          return;
        }}
        mouseName="phantom"
      >
        +Todo
      </TodoAdder>
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
