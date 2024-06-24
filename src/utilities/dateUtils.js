import { matchPositionsToIndices } from "./reduxUtils";
import { sortTodosByDate } from "./todoUtils";
import { editTodo } from "../redux/persistentSlice";
import { editTransientTodo } from "../redux/transientSlice";

const days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

const isValidDoW = (dayOfWeek) => {
  return days.hasOwnProperty(dayOfWeek);
};

const getNextDate = (dayOfWeek) => {
  if (isDayInvalidOrBlank(dayOfWeek)) {
    return { year: "", month: "", day: "" };
  }

  let date = new Date();

  while (date.getDay() !== days[dayOfWeek]) {
    date.setDate(date.getDate() + 1);
  }

  return {
    year: finalDigits(date.getFullYear()),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
};

const finalDigits = (num, digits = 2) => {
  return parseInt(num.toString().slice(-digits));
};

export const matchingDay = (startString) => {
  if (startString === "") return undefined;

  return Object.keys(days).find((day) =>
    day.toLowerCase().startsWith(startString.toLowerCase())
  );
};

export const stringOverflowRestart = (newString, oldString, max = 3) => {
  console.log(`newString: ${newString}`);
  console.log(`oldString: ${oldString}`);
  return newString.length > max
    ? findDiffChar(newString, oldString)
    : newString;
};

export const differenceOfStrings = (string, substring) => {
  const substringSet = new Set(substring.toLowerCase().split(""));
  let difference = "";

  for (const char of string.toLowerCase()) {
    if (!substringSet.has(char)) {
      difference += char;
    }
  }

  return difference;
};

const findDiffChar = (str1, str2) => {
  const lowerStr1 = str1.toLowerCase();
  const lowerStr2 = str2.toLowerCase();

  const charCount1 = {};
  for (const char of lowerStr1) {
    charCount1[char] = (charCount1[char] || 0) + 1;
  }

  const charCount2 = {};
  for (const char of lowerStr2) {
    charCount2[char] = (charCount2[char] || 0) + 1;
  }

  for (const char in charCount1) {
    if (!charCount2[char] || charCount1[char] !== charCount2[char]) {
      return char;
    }
  }

  for (const char in charCount2) {
    if (!charCount1[char] || charCount1[char] !== charCount2[char]) {
      return char;
    }
  }

  return undefined;
};

export const isStringOrBlank = (str) => {
  return typeof str === "string" || str === "";
};

export const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const dispatchDateChange = (dispatch, todo, siblings, newlyTyped, sortedAs) => {
  const newDate = { ...getNextDate(newlyTyped), dow: newlyTyped };

  dispatch(
    editTodo({
      id: todo.id,
      edit: { date: newDate },
    })
  );
  dispatch(
    editTransientTodo({ id: todo.id, edit: { hasSortableChange: true } })
  );

  if (sortedAs === "date") {
    repositionFromNewDate(dispatch, todo, siblings, newDate);
  }
};

const isDayInvalidOrBlank = (day) => {
  return (day && !day.length) || !isValidDoW(day);
};



export const repositionFromNewDate = (dispatch, todo, allSiblings, newDate) => {
    const siblingsWithNewDate = allSiblings.map((sibling) =>
      sibling.id === todo.id ? { ...sibling, date: newDate } : sibling
    );
  
    const sortedSiblings = sortTodosByDate(siblingsWithNewDate);
  
    matchPositionsToIndices(dispatch, sortedSiblings);
  } 