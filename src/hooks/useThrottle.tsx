import { useCallback, useRef } from "react";

function useThrottle(callback: (...args: any[]) => void, delay: number) {
  const lastCallRef = useRef<number>(0);

  return useCallback(
    (...args: any[]) => {
      const now = new Date().getTime();
      if (now - lastCallRef.current >= delay) {
        callback(...args);
        lastCallRef.current = now;
      }
    },
    [callback, delay],
  );
}

export default useThrottle;
