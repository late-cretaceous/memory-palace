import useSortAnimation from "./useSortAnimation";
import useListDisplayUpdate from "./useListDisplayUpdate";
import { useSelector } from "react-redux";

const useTodoListState = (
  todos,
  parent,
  sort,
  introStepOn = true,
  outroStepOn = true
) => {
  const cascade = useSelector(
    (state) => state.transientSlice[parent.id].cascade
  );

  useSortAnimation(todos, parent, sort, introStepOn, outroStepOn);
  useListDisplayUpdate(parent, todos);

  return cascade;
};

export default useTodoListState;
