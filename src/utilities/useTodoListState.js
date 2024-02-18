import { useState } from "react";
import useSortAnimation from "./useSortAnimation";
import useSortedListStaticChanges from "./useSortedListStaticChanges";

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
  useSortedListStaticChanges(cascade, setCascade, todos);

  return cascade;
};

export default useTodoListState;
