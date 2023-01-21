import Header from "./components/Header";
import Todo from "./components/Todo/newTodo";

function App() {
  return (
    <>
      <Header />
      <Todo
        bigTodo
        todo={{ id: null, index: null, parent: null, message: "", list: [] }}
      />
    </>
  );
}

export default App;
