import Header from "./components/Header";
import Todo from "./components/Todo/Todo";
import TodoKit from "./utilities/storage";
import HSL from "./utilities/colors";

import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { toggle } from "./redux/labelSlice";

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

  //scaffold to print messages in case of update crash
  for (const todo of bigTodo.listHierarchy()) {
    console.log(`${todo.lineage.join(".")} ${todo.message}`);
  }

  //scaffold show/hide labels using reducer
  const dispatch = useDispatch();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "." && event.metaKey) {
        dispatch(toggle());
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dispatch]);

  console.log(color);
  const bColor = color.adjustedHSLBounded(30, -15, 25);
  console.log(bColor);

  return (
    <div
      style={{ backgroundColor: bColor }}
      className={'background'}
    >
      <Header color={color} />
      <Todo
        todo={bigTodo}
        parent={null}
        color={color}
        spectrumRange={60}
        lightRange={color.randomSignWithinBounds(20, "light")}
        onResize={() => null}
      />
    </div>
  );
}

export default App;
