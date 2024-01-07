import Header from "./components/Header";
import Todo from "./components/Todo/Todo";
import HSL from "./utilities/colors";
import { useDispatch } from "react-redux";
import { addExistingTodo } from "./redux/persistentSlice";
import { addTransientTodo } from "./redux/transientSlice";
import { useEffect } from "react";
import { fetchTodo } from "./utilities/databaseUtils";

function App() {
  const dispatch = useDispatch();

  const bigTodo = fetchTodo("bigTodo") ?? {
    id: "bigTodo",
    lineage: [],
    index: null,
    parent: null,
    message: "",
    list: [],
  };

  dispatch(addExistingTodo(bigTodo));
  dispatch(addTransientTodo({ id: bigTodo.id, listOpen: true }));

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
        family={{ todo: bigTodo, parent: null, siblings: [] }}
        color={color}
        spectrumRange={spectrumRange}
        lightRange={lightRange}
        onResize={() => null}
      />
    </div>
  );
}

export default App;
