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
    focused,
  };

  return (
    <div className={styles["date-form"]}>
      <DateInput name="month" {...inputProps} />
      <DateInput name="day" {...inputProps} />
      <DateInput name="year" {...inputProps} />
    </div>
  );
};

export default DateForm;
