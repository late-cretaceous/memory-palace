import Header from "./components/Header";
import Todo from "./components/Todo/Todo";
import TodoKit from "./utilities/storage";

function App() {
  const storageEmpty = !localStorage.getItem("bigTodo");

  const bigTodo = storageEmpty
    ? {
        level: 0,
        id: "bigTodo",
        label: [],
        index: null,
        parent: null,
        message: "",
        list: [],
        listLoaded: true
      }
    : TodoKit.pull("bigTodo");

  if (storageEmpty) {
    new TodoKit(bigTodo).store();
  }

  return (
    <>
      <Header />
      <Todo todo={bigTodo} parent={null} />
    </>
  );
}

export default App;
