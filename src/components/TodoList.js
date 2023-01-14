import styles from "./TodoList.module.css";
import Todo from "./Todo/Todo";
import storage from '../utilities/storage';
import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Todos } from '../utilities/storage';

const todoInstance = new Todos();

const TodoList = () => {
  const [todos, setTodos] = useState(storage.retrieveAll());
  let recentMouseDown = false;

  todoInstance.list = todos;

  const removeTodoHandler = (e) => {
    todoInstance.remove(e.target.id);

    localStorage.removeItem(e.target.id);

    setTodos(todoInstance.list);
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


  const addTodoHandler = (e) => {
    if (!recentMouseDown) return;

    const todo = todoInstance.add();
    storage.set(todo);

    setTodos(todoInstance.list);
  };

  const allowAddHandler = (e) => {
    recentMouseDown = true;

    setTimeout(() => {
      recentMouseDown = false;
    }, 250);
  };

  const dragEndHandler = (e) => {
    if (!e.destination) return;

    todoInstance.move(e.source.index, e.destination.index);
    storage.updateOrder(todoInstance.list);

    setTodos(Array.from(todoInstance.list));
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
