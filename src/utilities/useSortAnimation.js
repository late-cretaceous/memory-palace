import { useState, useEffect } from "react";

const useSortAnimation = (todos, sort) => {
  const [cascade, setCascade] = useState({
    index: 0,
    initialize: false,
    on: false,
    sort: sort,
    unsortedList: todos,
    sortedList: todos,
  });

  if (cascade.sort !== sort) {
    setCascade((prev) => {
      return {
        ...prev,
        sort: sort,
        initialize: true,
        unsortedList: cascade.sortedList,
      };
    });
  }

  useEffect(() => {
    if (!cascade.initialize || cascade.on) return;

    //Timeout here is for testing only
    setTimeout(() => {
      setCascade((prev) => {
        return { ...prev, on: true };
      });
    }, 0);
  }, [cascade.initialize, cascade.on]);

  if (cascade.on && cascade.initialize) {
    const sortedList =
      sort === "date"
        ? Array.from(todos).sort((a, b) => a.message.length - b.message.length)
        : todos;

    setCascade((prev) => {
      return {
        ...prev,
        initialize: false,
        sortedList: sortedList,
      };
    });
  }

  useEffect(() => {
    if (!cascade.on) {
      return;
    } else if (cascade.index >= todos.length) {
      setCascade((prev) => {
        return { ...prev, on: false, index: 0 };
      });
    }

    const timeoutId = setTimeout(() => {
      setCascade((prev) => {
        return { ...prev, index: prev.index + 1 };
      });
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [cascade.on, cascade.index, todos.length]);



  return cascade;
};

export default useSortAnimation;
