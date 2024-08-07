import styles from "./TodoList.module.css";
import todoStyles from "./Todo.module.css";
import Todo from "./Todo";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { forwardRef } from "react";
import useSortAnimation from "../../utilities/useSortAnimation";
import useListDisplayUpdate from "../../utilities/useListDisplayUpdate";
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
import useTransientTrimmer from "../../utilities/useTransientTrimmer";

const TodoList = forwardRef(({ parent, ...props }, ref) => {
  const dispatch = useDispatch();
  const cascade = useSelector(
    (state) => state.transientSlice[parent.id].cascade
  );

  const { listPulled, singleSort } = useSelector(
    (state) => state.transientSlice[parent.id]
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
  const transients = useSelector((state) => state.transientSlice);

  const sort = useSelector((state) => state.globalSlice.sort);

  useSortAnimation(todos, parent, sort);
  useListDisplayUpdate(parent, todos);

  const animationTime = 1000;

  const moveTodoHandler = (e) => {
    dispatch(moveTodo(e, parent, todos));
  };

  const todoAnimationExitHandler = (todoId) => {
    if (singleSort.id === todoId) {
      dispatch(
        editTransientTodo({
          id: parent.id,
          edit: { singleSort: { ...singleSort, stage: "adding" } },
        })
      );
    }
  };

  useTransientTrimmer(animationTime);

  const lengthForHeaderAndBackground = todos.length + 2;
  const spectrum = props.color.shades(
    {
      hue: props.color.hue + props.spectrumRange,
      sat: props.color.sat,
      light: props.color.light + props.lightRange,
    },
    lengthForHeaderAndBackground
  );

  //console.log(spectrumLog(spectrum, props.spectrumRange, 0, props.lightRange))

  const todoTransitionClass = {
    enter: cascade.on ? "" : todoStyles.enter,
    enterActive: cascade.on ? "" : todoStyles.enterActive,
    exit: todoStyles.exit,
    exitActive: todoStyles.exitActive,
  };

  const unhiddenOrderedTodos =
    cascade.phase === "cascade"
      ? cascade.sortedList.slice(0, cascade.index + 1)
      : isInitialPhase(cascade.phase) || cascade.sort !== "manual"
      ? cascade.sortedList
      : todos;

  const orderedTodos = unhiddenOrderedTodos.filter(
    (todo) => !transients[todo.id].hide
  );

  const cascadeOutTodos = cascade.on
    ? cascade.unsortedList
        .slice(cascade.index + 1, cascade.unsortedList.length)
        .map((todo, index) => {
          return (
            <Todo
              familyIds={{
                todo: todo.id,
                parent: parent.id,
                siblings: todos.map((todo) => todo.id),
              }}
              todoObj={todo}
              key={todo.id}
              color={spectrum[index + 1]}
              spectrumRange={(props.spectrumRange * 2) / todos.length}
              lightRange={(props.lightRange * 2) / todos.length}
              index={index}
              old={true}
            />
          );
        })
    : "";

  const todoComponentList = todos.length ? (
    orderedTodos.map((todo, index) => {
      return (
        <CSSTransition
          key={todo.id}
          timeout={cascade.on ? 0 : animationTime}
          classNames={{ ...todoTransitionClass }}
          onExited={() => {
            todoAnimationExitHandler(todo.id);
          }}
        >
          <Draggable
            key={todo.id}
            draggableId={todo.id}
            index={index}
            isDragDisabled={transients[todo.id].sortedAs !== "manual"}
          >
            {(provided) => (
              <div ref={provided.innerRef}>
                <Todo
                  familyIds={{
                    todo: todo.id,
                    parent: parent.id,
                    siblings: todos.map((todo) => todo.id),
                  }}
                  todoObj={todo}
                  provided={provided}
                  color={spectrum[index + 1]}
                  spectrumRange={(props.spectrumRange * 2) / todos.length}
                  lightRange={(props.lightRange * 2) / todos.length}
                  index={index}
                  old={false}
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
      timeout={animationTime}
      classNames={{ ...todoStyles }}
    >
      <TodoAdder
        {...props.emptyListAdderProps}
        parent={parent}
        siblings={[]}
        todoID={parent.id}
        color={props.color}
        className={"phantom"}
        mouseName="phantom"
      >
        +Todo
      </TodoAdder>
    </CSSTransition>
  );

  return (
    <div
      className={`${styles.flexcol} ${styles.container}`}
      style={props.style}
      ref={ref}
    >
      {!isEmptyAndCascading(orderedTodos, cascade) && (
        <DragDropContext onDragEnd={moveTodoHandler}>
          <Drop id="todoDropArea">
            <ul
              className={`${styles.flexcol} ${styles.list} ${
                isInitialPhase(cascade.phase) ? styles.front : ""
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
          isInitialPhase(cascade.phase) ? styles.back : ""
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

const isEmptyAndCascading = (list, cascade) =>
  !Boolean(list.length) && cascade.on;

const isInitialPhase = (phase) =>
  new Set(["initializing", "awaitingListClose", "initialized"]).has(phase);

export default TodoList;
