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

export const saveTodo = (todo) => {
  localStorage.setItem(todo.id, JSON.stringify(todo));
};

export const removeTodo = (id) => {
  const action = { id: id, descendants: listHierarchy(id) };

  return (dispatch) => {
    dispatch(removeTransientTodo(action));
    dispatch(removePersistentTodo(action));
  };
};

export const moveTodo = (e, parent, todos) => {
  const movedTodos = moveItem(todos, e.source.index, e.destination.index);
  const reorderedTodos = reIndex(movedTodos);
  const newParent = { ...parent, list: Object.keys(reorderedTodos) };

  return (dispatch) => {
    dispatch(
      updateStateAndStore({ [newParent.id]: newParent, ...reorderedTodos })
    );
    dispatch(
      editTransientTodos(
        Object.values(reorderedTodos).map((todo) => ({
          id: todo.id,
          edit: { position: todo.index },
        }))
      )
    );
  };

  //Separate out reIndex from splice in moveTodo so you can use that in the other two
  //Todo: updated removeTodo and include addTodo to both to reorder transient todos
};
