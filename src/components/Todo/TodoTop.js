import styles from "./TodoHead.module.css";
import DateForm from "./DateForm";
import CloseButton from "./CloseButton";

const TodoTop = ({ family, ...props }) => {
  return (
    <div
      className={`${styles["todohead-row"]} ${styles["todohead-row__cancel"]}`}
    >
      <h5 className={`${styles.label}`}>{props.labelDisplay}</h5>
      <DateForm
        todo={family.todo}
        color={props.color}
        negativeColor={props.negativeColor}
        old={props.old}
      />
      <CloseButton
        family={family}
        color={props.color}
      />
    </div>
  );
};

export default TodoTop;
