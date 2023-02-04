import styles from "./TodoList.module.css";
import Todo from "./Todo";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const TodoList = (props) => {
  let recentMouseDown = false;

  const todoComponentList = props.todos.map((todo, index) => {
    return (
      <Draggable key={todo.id} draggableId={todo.id} index={index}>
        {(provided) => (
          <Todo
            todo={todo}
            ref={provided.innerRef}
            provided={provided}
            onClose={props.onRemove}
          />
        )}
      </Draggable>
    );
  });

  const allowAddHandler = (e) => {
    recentMouseDown = true;

    setTimeout(() => {
      recentMouseDown = false;
    }, 250);
  };

  const todoAddHandler = () => {
    if (!recentMouseDown) return;
    props.onAdd();
  };

  const listContent = props.todos.length ? (
    <DragDropContext onDragEnd={props.onMove}>
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
  ) : (
    ""
  );

  return (
    <div
      className={styles.flexcol}
      onClick={todoAddHandler}
      onMouseDown={allowAddHandler}
    >
      {listContent}
    </div>
  );
};

export default TodoList;
