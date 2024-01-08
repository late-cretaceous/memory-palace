import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { trimTransientSlice } from "../redux/transientSlice";

function useTransientTrimmer(animationTime) {
  const dispatch = useDispatch();

  const transientLengthForTrimmer = useSelector(
    (state) => Object.keys(state.transientSlice).length
  );

  const persistentLengthForTrimmer = useSelector(
    (state) => Object.keys(state.persistentSlice).length
  );

  useEffect(() => {
    if (transientLengthForTrimmer > persistentLengthForTrimmer) {
      console.log("trimming transientSlice in hook");
      const timeStamp = setTimeout(() => {
        dispatch(trimTransientSlice());
      }, animationTime + 1000);
      return () => clearTimeout(timeStamp);
    }
  }, [
    transientLengthForTrimmer,
    persistentLengthForTrimmer,
    animationTime,
    dispatch,
  ]);
}

export default useTransientTrimmer;
