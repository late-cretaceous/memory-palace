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

  const testTodo = new TodoKit(bigTodo);
  testTodo.pullDescendants();
  console.log(testTodo);

  return (
    <>
      <Header />
      <Todo todo={bigTodo} parent={null} />
    </>
  );
}

export default App;
