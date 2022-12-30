import styles from "./TodoList.module.css";
import Todo from "./Todo";
import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  let recentMouseDown = false;

  const todoComponentList = todos.map((todo, index) => (
    <Draggable key={todo.id} draggableId={todo.id} index={index}>
      {(provided) => (
        <Todo
          number={todo.id}
          content={todo.content}
          ref={provided.innerRef}
          provided={provided}
        />
      )}
    </Draggable>
  ));

  console.log(todos);

  const addTodoHandler = (e) => {
    if (!recentMouseDown) {
      return
    }
    setTodos((previous) => {
      return previous.concat([
        {
          content: (previous.length + 1).toString(),
          id: Math.random().toString(),
          index: previous.length,
        },
      ]);
    });
  };

  const allowAddHandler = e => {
    recentMouseDown = true;

    setTimeout(() => {
      recentMouseDown = false;
    }, 250);
  }

  return (
    <div className={styles.flexcol} onClick={addTodoHandler} onMouseDown={allowAddHandler}>
      <DragDropContext>
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
