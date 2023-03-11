import { Droppable } from "react-beautiful-dnd";

const Drop = ({id, type, ...props}) => {
  return (
    <Droppable droppableId={id} type={type}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps} {...props}>
            {props.children}
            {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default Drop;
