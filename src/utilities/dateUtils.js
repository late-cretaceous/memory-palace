import { matchPositionsToIndices } from "./reduxUtils";
import { sortTodosByDate } from "./todoUtils";

export const repositionFromNewDate = (dispatch, todo, allSiblings, newDate) => {
    const siblingsWithNewDate = allSiblings.map((sibling) =>
      sibling.id === todo.id ? { ...sibling, date: newDate } : sibling
    );
  
    const sortedSiblings = sortTodosByDate(siblingsWithNewDate);
  
    matchPositionsToIndices(dispatch, sortedSiblings);
  } 