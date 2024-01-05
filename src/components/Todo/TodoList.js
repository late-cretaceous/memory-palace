import styles from "./TodoList.module.css";
import todoStyles from "./Todo.module.css";
import Todo from "./Todo";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { forwardRef } from "react";
import useSortAnimation from "../../utilities/useSortAnimation";
import Drop from "../../utilities/Drop";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { addExistingTodo } from "../../redux/persistentSlice";
import { fetchTodo } from "../../utilities/databaseUtils";
import {
  addTransientTodo,
  editTransientTodo,
} from "../../redux/transientSlice";
import TodoAdder from "./TodoAdder";
import { moveTodo } from "../../utilities/reduxUtils";

const TodoList = forwardRef(({ parent, ...props }, ref) => {
  const dispatch = useDispatch();

  const listPulled = useSelector(
    (state) => state.transientSlice[parent.id].listPulled
  );

  if (!listPulled) {
    parent.list.forEach((id) => {
      const todo = fetchTodo(id);

      dispatch(addExistingTodo(todo));
      dispatch(addTransientTodo({ id, position: todo.index }));
      dispatch(
        editTransientTodo({ id: parent.id, edit: { listPulled: true } })
      );
    });
  }

  const selectTodosMemoized = createSelector(
    [(state) => state.persistentSlice, (state, parent) => parent.id],
    (persistentSlice, parentId) =>
      persistentSlice[parentId]
        ? persistentSlice[parentId].list.map((id) => persistentSlice[id])
        : []
  );

  const todos = useSelector((state) => selectTodosMemoized(state, parent));

  const sort = useSelector((state) => state.globalSlice.sort);

  const cascade = useSortAnimation(todos, sort);
  
  console.table(useSelector((state) => state.transientSlice));

  const moveTodoHandler = (e) => {
    dispatch(moveTodo(e, parent, todos));
  };

  const lengthForHeaderAndBackground = todos.length + 2;
  const spectrum = props.color.shades(
    {
      hue: props.color.hue + props.spectrumRange,
      sat: props.color.sat,
      light: props.color.light + props.lightRange,
    },
    lengthForHeaderAndBackground
  );

  //console.log(spectrumLog(spectrum, props.spectrumRange, 0, props.lightRange));

  const orderedTodos =
    cascade.phase === "cascade"
      ? cascade.sortedList.slice(0, cascade.index)
      : cascade.phase === "initialize" || cascade.sort !== "manual"
      ? cascade.sortedList
      : todos;

  const cascadeOutTodos = cascade.on
    ? cascade.unsortedList
        .slice(cascade.index, cascade.unsortedList.length)
        .map((todo, index) => {
          return (
            <Todo
              todo={todo}
              key={todo.id}
              parent={parent}
              siblings={todos}
              color={spectrum[index + 1]}
              spectrumRange={(props.spectrumRange * 2) / todos.length}
              lightRange={(props.lightRange * 2) / todos.length}
              index={index}
            />
          );
        })
    : "";

  const todoComponentList = todos.length ? (
    orderedTodos.map((todo, index) => {
      return (
        <CSSTransition
          key={todo.id}
          timeout={cascade.on ? 0 : 1000}
          classNames={cascade.on ? "" : { ...todoStyles }}
        >
          <Draggable key={todo.id} draggableId={todo.id} index={index}>
            {(provided) => (
              <div ref={provided.innerRef}>
                <Todo
                  todo={todo}
                  parent={parent}
                  siblings={todos}
                  provided={provided}
                  color={spectrum[index + 1]}
                  spectrumRange={(props.spectrumRange * 2) / todos.length}
                  lightRange={(props.lightRange * 2) / todos.length}
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
        mouseName="phantom"
      >
        +Todo
      </TodoAdder>
    </CSSTransition>
  );

  return (
    <div className={styles.flexcol} style={props.style} ref={ref}>
      {Boolean(orderedTodos.length) && (
        <DragDropContext onDragEnd={moveTodoHandler}>
          <Drop id="todoDropArea">
            <ul
              className={`${styles.flexcol} ${styles.list} ${
                cascade.phase === "initialize" ? styles.front : ""
              }`}
            >
              <TransitionGroup component={null}>
                {todoComponentList}
              </TransitionGroup>
            </ul>
          </Drop>
        </DragDropContext>
      )}
      <ul
        className={`${styles.flexcol} ${styles.list} ${
          cascade.phase === "initialize" ? styles.back : ""
        }`}
      >
        {cascadeOutTodos}
      </ul>
    </div>
  );
});

const spectrumLog = (spectrum, hueStep, satStep, lightStep) => {
  const shades = Array.from(spectrum, (shade) => shade.toString());
  const increments = `\nIncrements\nhue: ${hueStep}\nsaturation: ${satStep}\nlight: ${lightStep}`;

  return shades.join("\n") + "\n" + increments;
};

export default TodoList;
