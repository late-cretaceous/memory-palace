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

  const spectrumRange = 60;
  const lightRange = color.randomSignWithinBounds(20, "light");
  const bColor = color.adjustedHSLBounded(
    spectrumRange,
    -15,
    lightRange + lightRange * 0.2
  );
  console.log(`Background color: ${bColor}`);

  return (
    <div style={{ backgroundColor: bColor }} className={"background"}>
      <Header color={color} />
      <Todo
        todo={bigTodo}
        parent={null}
        color={color}
        spectrumRange={spectrumRange}
        lightRange={lightRange}
        onResize={() => null}
      />
    </div>
  );
}

export default App;
