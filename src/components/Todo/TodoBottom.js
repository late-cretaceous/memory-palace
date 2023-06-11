import styles from "./TodoHead.module.css";
import { useRef } from "react";

const TodoBottom = (props) => {
  const classList = `${styles["todohead-row"]} ${
    props.hover ? "" : styles.hidden
  }`;
  const containerRef = useRef();
  const containerStyle = props.hover ? containerRef.current.scrollHeight : 0;

  return (
    <div
      className={classList}
      ref={containerRef}
      style={{ height: `${containerStyle}px` }}
    >
      <button
        className={props.arrowOpen ? styles.arrowopen : ""}
        onClick={props.onListToggle}
      >
        {"\u25B6"}
      </button>
    </div>
  );
};

export default TodoBottom;
