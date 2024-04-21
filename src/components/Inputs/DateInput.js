import { useDispatch, useSelector } from "react-redux";
import { editTodo } from "../../redux/persistentSlice";
import { editTransientTodo } from "../../redux/transientSlice";
import { useState } from "react";
import styles from "./DateInput.module.css";

const DateInput = ({ todo, name, ...props }) => {
  const [selfHover, setSelfHover] = useState(false);
  const [selfFocus, setSelfFocus] = useState(false);
  const dispatch = useDispatch();
  const date = useSelector(
    (state) =>
      state.persistentSlice[todo.id]?.date ?? {
        month: null,
        day: null,
        year: null,
      }
  );

  const { inCascade, sortedAs: parentSortedAs } = useSelector(
    (state) => state.transientSlice[todo.id]
  );
  const { sort } = useSelector((state) => state.globalSlice);

  const parentHover = useSelector(
    (state) => state.transientSlice[todo.id].hover
  );

  const handleMouseEnter = () => setSelfHover(true);
  const handleMouseLeave = () => setSelfHover(false);
  const handleFocus = () => {
    setSelfFocus(true);
    props.onFocus();
  };

  const handleInputChange = (e) => {
    const twoDigitValue = e.target.value.slice(0, 2);

    if (!isNaN(twoDigitValue)) {
      dispatch(
        editTodo({
          id: todo.id,
          edit: { date: { ...date, [name]: twoDigitValue } },
        })
      );

      dispatch(
        editTransientTodo({ id: todo.id, edit: { hasSortableChange: true } })
      );
    }
  };

  const handleBlur = () => {
    props.onBlur();
    setSelfFocus(false);

    const dayLimits = {
      month: 12,
      day: 31,
      year: 99,
    };

    const exceeds =
      (name === "month" && date[name] > dayLimits[name]) ||
      (name === "day" && date[name] > dayLimits[name]) ||
      (name === "year" && date[name] > dayLimits[name]);

    if (exceeds) {
      dispatch(
        editTodo({
          id: todo.id,
          edit: {
            date: { ...date, [name]: dayLimits[name].toString() },
          },
        })
      );
    }
  };

  const isDateEmpty = isEmpty(date[name]);
  const shouldFadeLight =
    isDateEmpty && !selfHover && !props.focused && !selfFocus;
  const shouldFadeMedium =
    !selfFocus &&
    ((props.focused && !selfHover) ||
      (isDateEmpty && selfHover) ||
      (parentHover && !selfHover));
  const shouldFadeHeavy = selfFocus || (!isDateEmpty && selfHover);

  const backgroundColor = shouldFadeLight
    ? props.color.faded(0.25)
    : shouldFadeMedium
    ? props.color.faded(2.5)
    : shouldFadeHeavy
    ? props.color.faded(5)
    : props.color.faded(1);

  const invisible =
    !props.focused &&
    (isOldAndCascadingIntoDate(inCascade, props.old, sort) ||
      recentSortableChangeAndNotHoveredInManual(
        props.old,
        parentHover,
        parentSortedAs
      ));

  const wrapperClasses = `${styles.wrapper} ${invisible ? styles.hidden : ""}`;

  return (
    <div
      className={wrapperClasses}
      style={{ backgroundColor: backgroundColor }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <input
        style={{ color: props.color }}
        className={styles["input-el"]}
        type="text"
        name={name}
        value={date[name]}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
};

const isEmpty = (field) => !Boolean(field);

const isOldAndCascadingIntoDate = (inCascade, old, sort) => {
  return inCascade && old && sort === "date";
};

const recentSortableChangeAndNotHoveredInManual = (hover, old, sortedAs) => {
  return !old && !hover && sortedAs === "manual";
};

export default DateInput;
