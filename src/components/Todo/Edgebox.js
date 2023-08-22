import { useState } from "react";
import styles from "./TodoHead.module.css";

const Edgebox = (props) => {
  const [edgeBoxTimeout, setEdgeBoxTimeout] = useState(null);
  const index = props.top ? props.todoIndex : props.todoIndex + 1;

  const onEdgeBoxEnter = (e, index) => {
    const edgeTimeoutId = setTimeout(() => {
      props.mouseEdgeEnterHandler(e, index);
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
      props.mouseEdgeLeaveHandler();
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
