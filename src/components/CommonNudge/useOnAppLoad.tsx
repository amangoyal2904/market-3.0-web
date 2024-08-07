import { useEffect, useRef } from "react";
import { useStateContext } from "@/store/StateContext";

const useOnAppLoad = (callback: any) => {
  const { state } = useStateContext();
  const hasRun = useRef(false);

  useEffect(() => {
    // Check if the conditions are met and the callback hasn't run yet
    if (!hasRun.current && state.login) {
      hasRun.current = true;
      callback();
    }
  }, [state]);
};

export default useOnAppLoad;
