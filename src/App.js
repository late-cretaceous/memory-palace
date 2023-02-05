import Header from "./components/Header";
import Todo from "./components/Todo/Todo";
import TodoKit from "./utilities/storage";

function App() {
  const storageEmpty = !localStorage.getItem("bigTodo");

  const bigTodo = storageEmpty
    ? {
        level: 0,
        id: "bigTodo",
        label: null,
        index: null,
        parent: null,
        message: "",
        list: []
      }
    : TodoKit.pull("bigTodo");

  if (storageEmpty) {
    new TodoKit(bigTodo).store();
  }

  return (
    <>
      <Header />
      <Todo bigTodo todo={bigTodo} />
    </>
  );
}

export default App;
