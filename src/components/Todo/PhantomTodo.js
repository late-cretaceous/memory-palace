import styles from "./Todo.module.css";
import { useEffect, useState } from "react";

const PhantomTodo = (props) => {
  const classes = `${styles[props.className]} ${styles.todo} ${styles.phantom}`;

  return (
    <div
      className={classes}
      onClick={props.onAdd}
      style={props.style}
      onMouseLeave={props.mouseEdgeLeaveHandler}
      data-name={"add"}
    >
      {props.children}
    </div>
  );
};

export default PhantomTodo;
