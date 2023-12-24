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
    on: false,
    sort: "manual",
    previousList: [],
    cascadingList: [],
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
    const previousList = cascade.cascadingList.length
      ? previousTodosFrom(cascade.cascadingList)
      : previousTodosFrom(todos);

    const sortedList =
      sort === "date"
        ? Array.from(todos).sort((a, b) => a.message.length - b.message.length)
        : todos;

    setCascade((prev) => {
      return {
        ...prev,
        on: true,
        sort: sort,
        previousList: previousList,
        sortedList: sortedList,
      };
    });
  }
  //console.log(sort);
  //console.log(cascade);

  useEffect(() => {
    if (!cascade.on) {
      return;
    } else if (cascade.index >= todos.length) {
      setCascade((prev) => {
        return { ...prev, on: false, index: 0 };
      });
    }
    console.log(cascade.index);
    for (const todo of cascade.cascadingList) {
      console.log(todo.message);
    }
    console.log("---");

    setCascade((prev) => {
      return {
        ...prev,
        cascadingList: mergeArraysAtIdx(
          cascade.sortedList,
          cascade.previousList,
          cascade.index
        ),
      };
    });
    console.table(
      mergeArraysAtIdx(cascade.previousList, cascade.sortedList, cascade.index)
    );

    const timeoutId = setTimeout(() => {
      setCascade((prev) => {
        return { ...prev, index: prev.index + 1 };
      });
    }, 2500);

    return () => clearTimeout(timeoutId);
  }, [
    cascade.on,
    cascade.cycling,
    cascade.index,
    todos.length,
    cascade.previousList,
    cascade.sortedList,
    setCascade,
  ]);

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

  const orderedTodos = cascade.on ? cascade.cascadingList : todos;
  const CSSTransitionProps = (todo) => {
    return cascade.on
      ? {
          key: todo.placeholderKey ?? todo.id,
          timeout: 0,
        }
      : {
          key: todo.id,
          timeout: 1000,
          classNames: { ...todoStyles },
        };
  };

  const todoComponentList = todos.length ? (
    orderedTodos.map((todo, index) => {
      return (
        <CSSTransition
          {...CSSTransitionProps(todo)}
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
    </div>
  );
});

const spectrumLog = (spectrum, hueStep, satStep, lightStep) => {
  const shades = Array.from(spectrum, (shade) => shade.toString());
  const increments = `\nIncrements\nhue: ${hueStep}\nsaturation: ${satStep}\nlight: ${lightStep}`;

  return shades.join("\n") + "\n" + increments;
};

export default TodoList;
