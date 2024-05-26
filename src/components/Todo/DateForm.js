import DateInput from "../Inputs/DateInput";
import DayOfWeekInput from "../Inputs/DayOfWeekInput";
import styles from "./DateForm.module.css";
import { useState, useEffect } from "react";

const DateForm = ({ todo, ...props }) => {
  const [focused, setFocused] = useState(false);
  const [inputWidths, setInputWidths] = useState({ day: 0, month: 0, year: 0 });
  const [inputHeight, setInputHeight] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const formWidth = hovered || focused
    ? Object.values(inputWidths).reduce((acc, curr) => acc + curr, 0)
    : Object.values(inputWidths)[0];

  const sendInputWidth = (name, width) => {
    setInputWidths((prev) => ({ ...prev, [name]: width }));
  };

  useEffect(() => {
    if (Boolean(formWidth) && !initialized) {
      setInitialized(true);
    }
  }, [formWidth, initialized]);

  const inputProps = {
    todo,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    color: props.color,
    negativeColor: props.negativeColor,
    old: props.old,
    focused,
    sendInputWidth,
    inputWidths,
    setInputHeight,
    inputHeight,
    formHover: hovered,
  };

  const numberInputsClasses = `${styles["number-inputs"]} ${
    initialized && styles.transition
  }`;

  return (
    <div
      className={styles["date-form"]}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={numberInputsClasses}
        style={{
          width: `${formWidth}px`,
          height: `${inputHeight}px`,
        }}
      >
        <DateInput name="month" {...inputProps} />
        <DateInput name="day" {...inputProps} />
        <DateInput name="year" {...inputProps} />
      </div>
    </div>
  );
};

export default DateForm;
