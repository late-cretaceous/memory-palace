import styles from "./TodoList.module.css";
import Todo from "./Todo/Todo";
import storage from '../utilities/storage';
import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Todos } from '../utilities/storage';

const reIndexTodos = (todos) => {
  todos.forEach((todo, index) => (todo.index = index));
};

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
  
    storage.set(todo);

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
      draggedTodo.index = e.destination.index;
      newTodos.splice(draggedTodo.index, 0, draggedTodo);

      reIndexTodos(newTodos);
      storage.updateOrder(newTodos);

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
