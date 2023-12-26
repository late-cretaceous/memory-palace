import styles from "./TodoList.module.css";
import todoStyles from "./Todo.module.css";
import Todo from "./Todo";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { forwardRef, useEffect, useState } from "react";
import Drop from "../../utilities/Drop";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { moveTodo, addExistingTodo } from "../../redux/persistentSlice";
import { fetchTodo } from "../../utilities/databaseUtils";
import {
  mergeArraysAtIdx,
  previousTodosFrom,
} from "../../utilities/animationUtils";
import {
  addTransientTodo,
  editTransientTodo,
} from "../../redux/transientSlice";
import TodoAdder from "./TodoAdder";

const TodoList = forwardRef(({ parent, ...props }, ref) => {
  const [cascade, setCascade] = useState({
    index: 0,
    initialize: false,
    on: false,
    sort: "manual",
    unsortedList: [],
    sortedList: [],
  });

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

  const selectTodosMemoized = createSelector(
    [(state) => state.persistentSlice, (state, parent) => parent.id],
    (persistentSlice, parentId) =>
      persistentSlice[parentId]
        ? persistentSlice[parentId].list.map((id) => persistentSlice[id])
        : []
  );

  const todos = useSelector((state) => selectTodosMemoized(state, parent));

  const sort = useSelector((state) => state.globalSlice.sort);

  if (cascade.sort !== sort) {
    setCascade((prev) => {
      return { ...prev, sort: sort, initialize: true };
    });
  }

  useEffect(() => {
    if (!cascade.initialize) return;

    setCascade((prev) => {
      return { ...prev, on: true };
    });
  }, [cascade.initialize]);

  if (cascade.on && cascade.initialize) {
    const unsortedList = cascade.sortedList.length ? cascade.sortedList : todos;

    const sortedList =
      sort === "date"
        ? Array.from(todos).sort((a, b) => a.message.length - b.message.length)
        : todos;

    setCascade((prev) => {
      return {
        ...prev,
        initialize: false,
        unsortedList: unsortedList,
        sortedList: sortedList,
      };
    });
  }

  useEffect(() => {
    if (!cascade.on) {
      return;
    } else if (cascade.index >= todos.length) {
      setCascade((prev) => {
        return { ...prev, on: false, index: 0 };
      });
    }

    const timeoutId = setTimeout(() => {
      setCascade((prev) => {
        return { ...prev, index: prev.index + 1 };
      });
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [cascade.on, cascade.index, todos.length]);

  const moveTodoHandler = (e) => {
    dispatch(moveTodo(e));
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

  const orderedTodos = cascade.on
    ? cascade.sortedList.slice(0, cascade.index)
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
          timeout={ cascade.initialize || cascade.on ? 0 : 1000}
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
      <DragDropContext onDragEnd={moveTodoHandler}>
        <Drop id="todoDropArea">
          <ul className={`${styles.flexcol} ${styles.list}`}>
            <TransitionGroup component={null}>
              {todoComponentList}
            </TransitionGroup>
          </ul>
        </Drop>
      </DragDropContext>
      {cascadeOutTodos}
    </div>
  );
});

const spectrumLog = (spectrum, hueStep, satStep, lightStep) => {
  const shades = Array.from(spectrum, (shade) => shade.toString());
  const increments = `\nIncrements\nhue: ${hueStep}\nsaturation: ${satStep}\nlight: ${lightStep}`;

  return shades.join("\n") + "\n" + increments;
};

export default TodoList;
