import DateInput from "../Inputs/DateInput";
import styles from "./DateForm.module.css";

const DateForm = ({ todo, ...props }) => {
  return (
    <div className={styles["date-form"]}>
      <DateInput
        todo={todo}
        name="month"
        color={props.color}
        negativeColor={props.negativeColor}
      />
      <DateInput
        todo={todo}
        name="day"
        color={props.color}
        negativeColor={props.negativeColor}
      />
      <DateInput
        todo={todo}
        name="year"
        color={props.color}
        negativeColor={props.negativeColor}
      />
    </div>
  );
};

export default DateForm;
