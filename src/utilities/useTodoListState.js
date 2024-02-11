import { useState } from "react";
import useSortAnimation from "./useSortAnimation";

const useTodoListState = (
  todos,
  sort,
  introStepOn = true,
  outroStepOn = true
) => {
  const [cascade, setCascade] = useState({
    index: introStepOn ? -1 : 0,
    phase: "off",
    on: false,
    sort: sort,
    unsortedList: todos,
    sortedList: todos,
    outroStep: false,
    switchColor: false,
  });
  

  useSortAnimation(cascade, setCascade, todos, sort, introStepOn, outroStepOn);

  return cascade;
};

export default useTodoListState;
