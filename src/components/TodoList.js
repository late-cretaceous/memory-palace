import styles from "./TodoList.module.css";
import Todo from "./Todo";
import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  let recentMouseDown = false;

  const removeTodoHandler = (e) => {
    const index = todos.findIndex(
      (todo) => todo.id === e.target.id
    );
    
    const removee = todos[index];

    setTodos(todos.filter(todo => todo.id !== removee.id));
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

  const addTodoHandler = (e) => {
    if (!recentMouseDown) return;

    setTodos((previous) => {
      return previous.concat([
        {
          id: (previous.length + 1).toString(),
          index: previous.length,
        },
      ]);
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
