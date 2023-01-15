import styles from "./TodoList.module.css";
import Todo from "./Todo/Todo";
import { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Todos from '../utilities/storage';

const todoKit = new Todos();

const TodoList = (props) => {
  const [todos, setTodos] = useState(todoKit.list);
  let recentMouseDown = false;

  const removeTodoHandler = (e) => {
    todoKit.remove(e.target.id);

    localStorage.removeItem(e.target.id);

    setTodos(todoKit.list);
  };

  const todoComponentList = todos.map((todo, index) => {
    return (
      <Draggable key={todo.id} draggableId={todo.id} index={index}>
        {(provided) => (
          <Todo
            id={todo.id}
            message={todo.message}
            ref={provided.innerRef}
            provided={provided}
            onClose={removeTodoHandler}
          />
        )}
      </Draggable>
    );
  });

  const addTodoHandler = (e) => {
    if (!recentMouseDown) return;

    const todo = todoKit.add(props.parent);
    todoKit.store(todo);

    setTodos(todoKit.list);
  };

  const allowAddHandler = (e) => {
    recentMouseDown = true;

    setTimeout(() => {
      recentMouseDown = false;
    }, 250);
  };

  const dragEndHandler = (e) => {
    if (!e.destination) return;

    todoKit.move(e.source.index, e.destination.index);
    todoKit.reorderStorage();

    setTodos(Array.from(todoKit.list));
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
