export const loadTodos = () => {
    try {
      let state = {};
      for (let i = 0; i < localStorage.length; i++){
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        state[key] = JSON.parse(value);
      }
      return state;
    } catch (err) {
      return undefined;
    }
  };

  export const saveTodo = todo => {
    localStorage.setItem(todo.id, JSON.stringify(todo));
  }