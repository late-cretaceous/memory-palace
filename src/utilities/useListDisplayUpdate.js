import { useSelector, useDispatch } from "react-redux";
import { editTransientTodo } from "../redux/transientSlice";
import { propertyById } from "./reduxUtils";

const useListDisplayUpdate = (cascade, setCascade, todos) => {
  const positions = useSelector((state) =>
    propertyById(state, todos, "position")
  );
  const parentId = todos[0].parent;
  const { newChildSort } = useSelector(
    (state) => state.transientSlice[parentId]
  );
  const dispatch = useDispatch();

  if (todoQuantitiesDiffer(cascade.sortedList, todos)) {
    const newList = [...todos];
    newList.sort((a, b) => positions[a.id] - positions[b.id]);

    setCascade({ ...cascade, sortedList: newList });
  }

  if (newChildSort.stage === "new") {
    dispatch(editTransientTodo({ id: newChildSort.id, edit: { hide: true } }));

    dispatch(
      editTransientTodo({
        id: parentId,
        edit: { newChildSort: { ...newChildSort, stage: "switching" } },
      })
    );
  }
};

const todoQuantitiesDiffer = (lista, listb) => lista.length !== listb.length;

export default useListDisplayUpdate;
