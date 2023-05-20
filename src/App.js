import Header from "./components/Header";
import Todo from "./components/Todo/Todo";
import TodoKit from "./utilities/storage";
import HSL from "./utilities/colors";

function App() {
  const storageEmpty = !localStorage.getItem("bigTodo");

  const bigTodo = storageEmpty
    ? new TodoKit({
        id: "bigTodo",
        lineage: [],
        index: null,
        parent: null,
        message: "",
        list: [],
        listLoaded: true,
      })
    : TodoKit.pull("bigTodo");

  if (storageEmpty) {
    bigTodo.store();
  } else {
    bigTodo.pullDescendants();
  }

  const color = HSL.random();

  return (
    <>
      <Header color={color} />
      <Todo
        todo={bigTodo}
        parent={null}
        color={color}
        spectrumRange={60}
        lightRange={color.randomSignWithinBounds(20, "light")}
      />
    </>
  );
}

export default App;
