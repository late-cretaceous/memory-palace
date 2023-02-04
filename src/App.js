import Header from "./components/Header";
import Todo from "./components/Todo/Todo";

function App() {
  const bigTodo = {
    level: 0,
    id: "bigTodo",
    label: null,
    index: null,
    parent: null,
    message: "",
    list: [],
  }

  return (
    <>
      <Header />
      <Todo
        bigTodo
        todo={bigTodo}
      />
    </>
  );
}

export default App;
