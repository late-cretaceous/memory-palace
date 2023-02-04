import Header from "./components/Header";
import Todo from "./components/Todo/Todo";

function App() {
  return (
    <>
      <Header />
      <Todo
        bigTodo
        todo={{
          level: 0,
          id: "bigTodo",
          label: null,
          index: null,
          parent: null,
          message: "",
          list: [],
        }}
      />
    </>
  );
}

export default App;
