import Todo from "./Todo";
import TodoKit from "../../utilities/storage";

const PhantomTodo = (props) => {
  return (
    <Todo
      todo={new TodoKit({ ...props.parent, id: "phantom", })}
      color={props.color}
    />
  );
};

export default PhantomTodo;
