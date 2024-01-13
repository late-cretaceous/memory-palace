import { removePersistentTodo } from "../redux/persistentSlice";
import { editTransientTodos } from "../redux/transientSlice";
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

const stateUpdatesDispatch = (reorderedTodos) => {
  return (dispatch) => {
    dispatch(updateStateAndStore(reorderedTodos));
    dispatch(
      editTransientTodos(
        Object.values(reorderedTodos).map((todo) => ({
          id: todo.id,
          edit: { position: todo.index },
        }))
      )
    );
  };
};

export const saveTodo = (todo) => {
  localStorage.setItem(todo.id, JSON.stringify(todo));
};

export const removeTodo = (id, parent, todos) => {
  const action = { id: id, descendants: listHierarchy(id) };
  const newTodos = Object.values(todos).filter((todo) => todo.id !== id);
  const reorderedTodos = reIndex(newTodos);
  const newParent = { ...parent, list: Object.keys(reorderedTodos) };

  return (dispatch) => {
    dispatch(
      stateUpdatesDispatch({ ...reorderedTodos, [parent.id]: newParent })
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

export const addTodo = (parent, todos, index, isStarter) => {
  const newIndex = isStarter ? 0 : index + 1;
  const siblings = isStarter ? [] : todos;
  const newSibling = generateChild(parent, siblings, newIndex);
  siblings.splice(newIndex, 0, newSibling);

  const reorderedTodos = reIndex(siblings);
  const newParent = { ...parent, list: Object.keys(reorderedTodos) };

  return stateUpdatesDispatch({ ...reorderedTodos, [parent.id]: newParent });
}
