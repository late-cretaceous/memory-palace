import Header from "./components/Header";
import Todo from "./components/Todo/Todo";
import TodoKit from "./utilities/storage";
import HSL from "./utilities/colors";

import { useDispatch } from "react-redux";
import { addPersistentTodo } from "./redux/persistentSlice";
import { useEffect } from "react";

function App() {
  const bigTodo = new TodoKit({
    id: "bigTodo",
    lineage: [],
    index: null,
    parent: null,
    message: "",
    list: [],
    listLoaded: true,
  });

  const dispatch = useDispatch();

  dispatch(addPersistentTodo(bigTodo));

  const color = HSL.random();

  //scaffold show/hide labels using reducer
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "." && event.metaKey) {
        dispatch({ type: "label/toggle" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dispatch]);

  const spectrumRange = 60;
  const lightRange = color.randomSignWithinBounds(20, "light");
  const bColor = color.adjustedHSLBounded(spectrumRange, 0, lightRange);
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
