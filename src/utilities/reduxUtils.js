import { removePersistentTodo } from "../redux/persistentSlice";
import { addOrRemoveTransientAndReorder, editTransientTodo } from "../redux/transientSlice";
import { moveItem, reIndex, generateChild } from "./todoUtils";
import { listHierarchy } from "./databaseUtils";
import { updateStateAndStore } from "../redux/persistentSlice";

export const loadTodos = () => {
  try {
    let state = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      state[key] = JSON.parse(value);
    }
    return state;
  } catch (err) {
    return undefined;
  }
};

export const loadTodoKeys = () => {
  return Object.keys(localStorage);
};

const stateUpdatesDispatch = (reorderedTodos, newTodoInfo) => {
  return (dispatch) => {
    dispatch(updateStateAndStore(reorderedTodos));
    dispatch(addOrRemoveTransientAndReorder({todos: reorderedTodos, info: newTodoInfo}));
  };
};

export const saveTodo = (todo) => {
  localStorage.setItem(todo.id, JSON.stringify(todo));
};

export const removeTodo = (family, position) => {
  const {
    todo: { id },
    parent,
    siblings: todos,
  } = family;
  const action = { id: id, descendants: listHierarchy(id) };
  const newTodos = Object.values(todos).filter((todo) => todo.id !== id);
  const reorderedTodos = reIndex(newTodos);
  const newParent = { ...parent, list: Object.keys(reorderedTodos) };

  const removedTransientInfo = { id: id, position: position, type: "remove" };

  return (dispatch) => {
    dispatch(
      stateUpdatesDispatch(
        { ...reorderedTodos, [parent.id]: newParent },
        removedTransientInfo
      )
    );
    dispatch(removePersistentTodo(action));
  };
};

export const moveTodo = (e, parent, todos) => {
  const movedTodos = moveItem(todos, e.source.index, e.destination.index);
  const reorderedTodos = reIndex(movedTodos);
  const newParent = { ...parent, list: Object.keys(reorderedTodos) };

  return stateUpdatesDispatch({ ...reorderedTodos, [parent.id]: newParent });
};

export const addTodo = (parent, siblings, index, position, sorted) => {
  const newSibling = generateChild(parent, siblings, index);
  siblings.splice(index, 0, newSibling);

  const reorderedTodos = reIndex(siblings);
  const newParent = { ...parent, list: Object.keys(reorderedTodos) };
  const addedTransientInfo = {
    id: newSibling.id,
    position: position,
    type: "add",
    sorted: sorted,
  };

  return stateUpdatesDispatch(
    {
      ...reorderedTodos,
      [parent.id]: newParent,
    },
    addedTransientInfo
  );
};

export const propertyById = (state, todos, property) => {
  return todos.reduce((acc, todo) => {
    acc[todo.id] = state.transientSlice[todo.id][property];
    return acc;
  }, {});
}

export const matchPositionsToIndices = (dispatch, todoList) => {
  todoList.forEach((todo) => {
    dispatch(
      editTransientTodo({
        id: todo.id,
        edit: { inCascade: true, position: todoList.indexOf(todo) },
      })
    );
  });
}
