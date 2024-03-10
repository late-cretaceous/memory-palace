import styles from "./TodoHead.module.css";
import { useDispatch, useSelector } from "react-redux";
import { editTransientTodo } from "../../redux/transientSlice";
import { setEdgeBoxTimeoutId } from "../../redux/globalSlice";

const Edgebox = ({ todoID: id, ...props }) => {
  const index = props.top ? props.todoIndex : props.todoIndex + 1;
  const dispatch = useDispatch();
  const edgeBoxTimeoutId = useSelector((state) => state.globalSlice.edgeBoxTimeout);

  const onEdgeBoxEnter = (e) => {
    const mouseFrom = e.relatedTarget.dataset.name ?? null;

    if (mouseFrom === "add") return;
  
    const edgeTimeoutId = setTimeout(() => {
      dispatch(
        editTransientTodo({
          id,
          edit: { edgeActivated: { top: props.first, bottom: !props.first } },
        })
      );
      dispatch(setEdgeBoxTimeoutId(null));
    }, 200);

    dispatch(setEdgeBoxTimeoutId(edgeTimeoutId));
  };

  const onEdgeBoxLeave = (e) => {
    if (edgeBoxTimeoutId) {
      clearTimeout(edgeBoxTimeoutId);
      dispatch(setEdgeBoxTimeoutId(null));
      return;
    }

    const mouseTo = e.relatedTarget.dataset
      ? e.relatedTarget.dataset.name
      : null;

    if (mouseTo !== "add" && mouseTo !== "edgebox") {
      dispatch(
        editTransientTodo({
          id,
          edit: { edgeActivated: { top: false, bottom: false } },
        })
      );
    }

    dispatch(setEdgeBoxTimeoutId(null));
  };

  return (
    <div
      className={styles["edge-hitbox"]}
      onMouseEnter={(e) => {
        onEdgeBoxEnter(e, index);
      }}
      onMouseLeave={onEdgeBoxLeave}
      data-name="edgebox"
    ></div>
  );
};

export default Edgebox;
