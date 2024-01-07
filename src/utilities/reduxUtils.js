import { removePersistentTodo } from "../redux/persistentSlice";
import {
  removeTransientTodo,
  editTransientTodos,
} from "../redux/transientSlice";
import { moveItem, reIndex } from "./todoUtils";
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
    dispatch(stateUpdatesDispatch({...reorderedTodos, [parent.id]: newParent}));
    dispatch(removePersistentTodo(action));
  };
};

export const moveTodo = (e, parent, todos) => {
  const movedTodos = moveItem(todos, e.source.index, e.destination.index);
  const reorderedTodos = reIndex(movedTodos);
  const newParent = { ...parent, list: Object.keys(reorderedTodos) };

  return stateUpdatesDispatch({ ...reorderedTodos, [parent.id]: newParent });
};

//Separate out reIndex from splice in moveTodo so you can use that in the other two
//Todo: updated removeTodo and include addTodo to both to reorder transient todos
