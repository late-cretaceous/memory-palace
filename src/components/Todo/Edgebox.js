import { useState } from "react";
import styles from "./TodoHead.module.css";
import { useDispatch } from "react-redux";
import { editTransientTodo } from "../../redux/transientSlice";

const Edgebox = ({ todoID: id, ...props }) => {
  const [edgeBoxTimeout, setEdgeBoxTimeout] = useState(null);
  const index = props.top ? props.todoIndex : props.todoIndex + 1;
  const dispatch = useDispatch();

  const onEdgeBoxEnter = (e, index) => {
    const edgeTimeoutId = setTimeout(() => {
      dispatch(
        editTransientTodo({
          id,
          edit: { edgeActivated: { top: props.first, bottom: !props.first } },
        })
      );
      setEdgeBoxTimeout(null);
    }, 100);

    setEdgeBoxTimeout(edgeTimeoutId);
  };

  const onEdgeBoxLeave = (e) => {
    if (edgeBoxTimeout) {
      clearTimeout(edgeBoxTimeout);
      setEdgeBoxTimeout(null);
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

    setEdgeBoxTimeout(null);
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
