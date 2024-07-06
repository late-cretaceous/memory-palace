import Header from "./components/Header";
import Todo from "./components/Todo/Todo";
import HSL from "./utilities/colors";
import { useDispatch, useSelector } from "react-redux";
import { addExistingTodo } from "./redux/persistentSlice";
import { addTransientTodo } from "./redux/transientSlice";
import { useEffect, useState, useRef } from "react";
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
  const [renderCycleNumber, setRenderCycleNumber] = useState(0);

  const dispatch = useDispatch();
  const backgroundRef = useRef(null);
  const scrollPosition = useRef(0);

  if (!renderCycleNumber) {
    dispatch(addExistingTodo(bigTodo));
    dispatch(addTransientTodo({ id: bigTodo.id, listOpen: true }));

    setRenderCycleNumber(1);
  }

  const { phase: cascadePhase, index: cascadeIndex } = useSelector(
    (state) => state.transientSlice.bigTodo.cascade
  );

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

  useEffect(() => {
    if (scrollHoldConditions(cascadePhase, cascadeIndex, renderCycleNumber)) {
      if (backgroundRef.current) {
        backgroundRef.current.scrollTop = scrollPosition.current;
      }
      setRenderCycleNumber(2);
    }
  }, [cascadePhase, cascadeIndex, renderCycleNumber]);

  const handleScroll = () => {
    scrollPosition.current = backgroundRef.current.scrollTop;
  };

  const spectrumRange = 60;
  let bColor = color.adjustedHSLBounded(spectrumRange, 0, lightRange);
  const backgroundColorNegative = useSelector(
    (state) => state.globalSlice.backgroundColorNegative
  );
  bColor = backgroundColorNegative ? bColor.negative() : bColor;

  console.log(`Background color: ${bColor}`);

  return (
    <div
      style={{ backgroundColor: bColor }}
      className={"background"}
      ref={backgroundRef}
      onScroll={handleScroll}
    >
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

const scrollHoldConditions = (
  cascadePhase,
  cascadeIndex,
  renderCycleNumber
) => {
  return cascadePhase !== "off" || cascadeIndex >= 0 || renderCycleNumber === 1;
};

export default App;
