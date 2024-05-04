import Header from "./components/Header";
import Todo from "./components/Todo/Todo";
import HSL from "./utilities/colors";
import { useDispatch, useSelector } from "react-redux";
import { addExistingTodo } from "./redux/persistentSlice";
import { addTransientTodo } from "./redux/transientSlice";
import { useEffect, useState } from "react";
import { fetchTodo } from "./utilities/databaseUtils";

function App() {
  const [color] = useState(HSL.random());
  const [lightRange] = useState(color.randomSignWithinBounds(20, "light"));
  const [bigTodo] = useState(
    fetchTodo("bigTodo") ?? {
      id: "bigTodo",
      lineage: [],
      index: null,
      parent: null,
      message: "",
      list: [],
      date: { month: "", day: "", year: "" },
    }
  );
  const [firstRender, setFirstRender] = useState(true);

  const dispatch = useDispatch();

  if (firstRender) {
    dispatch(addExistingTodo(bigTodo));
    dispatch(addTransientTodo({ id: bigTodo.id, listOpen: true }));
    setFirstRender(false);
  }

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
  let bColor = color.adjustedHSLBounded(spectrumRange, 0, lightRange);
  const backgroundColorNegative = useSelector(
    (state) => state.globalSlice.backgroundColorNegative
  );
  bColor = backgroundColorNegative ? bColor.negative() : bColor;

  console.log(`Background color: ${bColor}`);

  return (
    <div style={{ backgroundColor: bColor }} className={"background"}>
      <Header color={color} />
      <Todo
        familyIds={{ todo: "bigTodo", parent: null, siblings: [] }}
        color={color}
        spectrumRange={spectrumRange}
        lightRange={lightRange}
        onResize={() => null}
      />
    </div>
  );
}

export default App;
