import Todo from "./Todo";
import TodoKit from "../../utilities/storage";

const PhantomTodo = (props) => {
  const adderClickedHandler = (e, index) => {
    props.onAdd(e, index);
  };

  return (
    <Todo
      todo={new TodoKit({ ...props.parent, id: "phantom", })}
      color={props.color}
      onAdd={adderClickedHandler}
      onResize={props.onResize}
    />
  );
};

export default PhantomTodo;
