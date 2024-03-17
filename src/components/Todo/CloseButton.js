import CloseIcon from "../../assets/CloseIcon";
import styles from "../UI/button.module.css";
import { useDispatch, useSelector } from "react-redux";
import { removeTodo } from "../../utilities/reduxUtils";
import { useState } from "react";

const CloseButton = ({ family, color }) => {
  const [selfHover, setSelfHover] = useState(false);
  const dispatch = useDispatch();
  const { position, hover: parentHover } = useSelector(
    (state) => state.transientSlice[family.todo.id]
  );

  const handleMouseEnter = () => {
    setSelfHover(true);
  };

  const handleMouseLeave = () => {
    setSelfHover(false);
  };

  const removeSelfHandler = () => {
    dispatch(removeTodo(family, position));
  };

  const colorFaded =
    parentHover && selfHover ? color.faded(2.5) : color.faded(1);

  return (
    <button
      type="button"
      className={`${styles.button} ${
        parentHover ? '' : styles.transparent
      }`}
      onClick={removeSelfHandler}
      id={family.todo.id}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CloseIcon fill={colorFaded} />
    </button>
  );
};

export default CloseButton;
