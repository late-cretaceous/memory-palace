import Header from "./components/Header";
import Todo from "./components/Todo/Todo";
import TodoKit from "./utilities/storage";
import HSL from "./utilities/colors";
import constants from "./components/constants";

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

  bigTodo.listHierarchy().forEach(todo => {
    todo.height = constants.TODO_HEIGHT_PX;
  });

  const color = HSL.random();

  //scaffold to print messages in case of update crash
  for (const todo of bigTodo.listHierarchy()) {
    console.log(`${todo.lineage.join('.')} ${todo.message}`);
  }

  return (
    <>
      <Header color={color} />
      <Todo
        todo={bigTodo}
        parent={null}
        color={color}
        spectrumRange={60}
        lightRange={color.randomSignWithinBounds(20, "light")}
        onResize={() => null}
      />
    </>
  );
}

export default App;
