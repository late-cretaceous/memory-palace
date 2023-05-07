import Header from "./components/Header";
import Todo from "./components/Todo/Todo";
import TodoKit from "./utilities/storage";
import HSL from "./utilities/colors";

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
        listLoaded: true,
      }
    : TodoKit.pull("bigTodo");

  if (storageEmpty) {
    new TodoKit(bigTodo).store();
  }

  const color = HSL.random();

  return (
    <>
      <Header color={color} />
      <Todo
        todo={bigTodo}
        parent={null}
        color={color}
        spectrumRange={color.randomSignWithinBounds(60, 'hue')}
      />
    </>
  );
}

export default App;
