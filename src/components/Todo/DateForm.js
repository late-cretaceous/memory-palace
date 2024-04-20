import DateInput from "../Inputs/DateInput";
import styles from "./DateForm.module.css";
import { useState } from "react";

const DateForm = ({ todo, ...props }) => {
  const [focused, setFocused] = useState(false);

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  const inputProps = {
    todo,
    onFocus: handleFocus,
    onBlur: handleBlur,
    color: props.color,
    negativeColor: props.negativeColor,
    old: props.old,
  };

  return (
    <div className={styles["date-form"]}>
      <DateInput timeUnit="month" {...inputProps} />
      <DateInput timeUnit="day" {...inputProps} />
      <DateInput timeUnit="year" {...inputProps} />
    </div>
  );
};

export default DateForm;
