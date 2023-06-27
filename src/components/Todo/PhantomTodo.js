import styles from "./Todo.module.css";
import { useState, useEffect } from "react";

const PhantomTodo = (props) => {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setExpanded(true));
  }, []);

  return (
    <div
      className={`${styles.todo} ${styles.phantom} ${
        expanded ? "" : styles.hidden
      }`}
      onClick={props.onAdd}
      style={props.style}
      onMouseLeave={props.mouseEdgeLeaveHandler}
      data-name={"add"}
    >
      {props.text}
    </div>
  );
};

export default PhantomTodo;
