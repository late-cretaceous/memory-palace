import Todo from "./Todo";

const PhantomTodo = (props) => {
  return <Todo todo={{ ...props.parent, id: "phantom" }} color={props.color} />;
};

export default PhantomTodo;
