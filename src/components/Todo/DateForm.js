import DateInput from "../Inputs/DateInput";
import styles from "./DateForm.module.css";
import { useState } from "react";

const DateForm = ({ todo, ...props }) => {
  const [focused, setFocused] = useState(false);
  const [inputWidths, setInputWidths] = useState({day: 0, month: 0, year: 0});
  const [hovered, setHovered] = useState(false);

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  const formWidth = Object.values(inputWidths).reduce(
    (acc, curr) => acc + curr,
    0
  );
  console.log(`formWidth: ${formWidth}`);

  const sendInputWidth = (name, width) => {
    setInputWidths((prev) => ({ ...prev, [name]: width }));
  };

  const inputProps = {
    todo,
    onFocus: handleFocus,
    onBlur: handleBlur,
    color: props.color,
    negativeColor: props.negativeColor,
    old: props.old,
    focused,
    sendInputWidth,
    inputWidths,
    formHover: hovered,
  };

  return (
    <div
      className={styles["date-form"]}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: `${formWidth}px`,
      }}
    >
      <DateInput name="month" {...inputProps} />
      <DateInput name="day" {...inputProps} />
      <DateInput name="year" {...inputProps} />
    </div>
  );
};

export default DateForm;
