import styles from "./TodoList.module.css";
import Todo from "./Todo/Todo";
import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const localStorageObjects = Object.values({ ...localStorage }).map((todo) =>
  JSON.parse(todo)
);

const TodoList = () => {
  const [todos, setTodos] = useState(localStorageObjects);
  let recentMouseDown = false;

  const removeTodoHandler = (e) => {
    const index = todos.findIndex((todo) => todo.id === e.target.id);

    const removee = todos[index];

    localStorage.removeItem(index);

    setTodos(todos.filter((todo) => todo.id !== removee.id));
  };

  const todoComponentList = todos.map((todo, index) => {
    return (
      <Draggable key={todo.id} draggableId={todo.id} index={index}>
        {(provided) => (
          <Todo
            id={todo.id}
            ref={provided.innerRef}
            provided={provided}
            onClose={removeTodoHandler}
          />
        )}
      </Draggable>
    );
  });

  console.log(todos);

  //id right now uses a scaffold to set a number (the lowest one that is missing)
  const generateScaffoldId = () => {
    let scaffoldCount = 0;
    if (todos.length) {
      let sortedTodoIds = Array.from(todos, (todo) => todo.id).sort();

      for (let i = 0; i < sortedTodoIds.length; i++) {
        if (!sortedTodoIds[i + 1]) {
          scaffoldCount = i + 1;
          break;
        } else if (sortedTodoIds[i] < sortedTodoIds[i + 1] - 1) {
          scaffoldCount = i + 1;
          break;
        }
      }
    }
    return scaffoldCount;
  };

  const addTodoHandler = (e) => {
    if (!recentMouseDown) return;

    const todo = {
      id: generateScaffoldId().toString(),
      index: todos.length,
    };

    localStorage.setItem(todo.id, JSON.stringify(todo));

    setTodos((previous) => {
      return previous.concat([todo]);
    });
  };

  const allowAddHandler = (e) => {
    recentMouseDown = true;

    setTimeout(() => {
      recentMouseDown = false;
    }, 250);
  };

  const dragEndHandler = (e) => {
    if (!e.destination) return;

    setTodos((previous) => {
      const newTodos = Array.from(previous);
      const [draggedTodo] = newTodos.splice(e.source.index, 1);
      newTodos.splice(e.destination.index, 0, draggedTodo);

      return newTodos;
    });
  };

  return (
    <div
      className={styles.flexcol}
      onClick={addTodoHandler}
      onMouseDown={allowAddHandler}
    >
      <DragDropContext onDragEnd={dragEndHandler}>
        <Droppable droppableId="todoDropArea">
          {(provided) => (
            <ul
              className={`${styles.flexcol} ${styles.list}`}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {todoComponentList}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TodoList;
