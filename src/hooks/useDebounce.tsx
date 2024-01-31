import { useRef, useEffect } from 'react';

interface DebounceHook {
  debounce: <T extends any[]>(func: (...args: T) => void, wait: number) => (...args: T) => void;
}

const useDebounce = (): DebounceHook => {
  const timeout = useRef<NodeJS.Timeout | null>(null);

  const debounce = <T extends any[]>(func: (...args: T) => void, wait: number) => (...args: T) => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => func(...args), wait);
  };

  useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);

  return { debounce };
};

export default useDebounce;
