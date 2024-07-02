import { useEffect, useRef, MutableRefObject } from "react";

const useIntervalApiCall = (
  callback: () => void,
  interval: number,
  dependencies: any[] = [],
  ref: MutableRefObject<HTMLElement | null> | null = null,
) => {
  const intervalId = useRef<NodeJS.Timeout | null>(null);
  const isVisible = useRef<boolean>(true); // Initialize isVisible ref to true

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Start the interval if the tab is active and element is in viewport
        startInterval();
      } else if (intervalId.current) {
        // Clear the interval if the tab is inactive
        clearInterval(intervalId.current);
      }
    };

    const startInterval = () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
      intervalId.current = setInterval(() => {
        if (!document.hidden && isVisible.current) {
          callback();
        }
      }, interval);
    };

    const observeElement = (element: HTMLElement) => {
      const observer = new IntersectionObserver(([entry]) => {
        isVisible.current = entry.isIntersecting;
        if (isVisible.current && !document.hidden) {
          // Element is visible and tab is active, start the interval
          startInterval();
        } else if (intervalId.current) {
          // Element is not visible, clear the interval
          clearInterval(intervalId.current);
        }
      });

      observer.observe(element);

      return () => {
        observer.unobserve(element);
        if (intervalId.current) {
          clearInterval(intervalId.current);
        }
      };
    };

    // Initial call and interval start if the tab is active and no ref or element is visible
    if (!document.hidden) {
      callback();
      startInterval();
    }

    // Listen for visibility change events
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Observe the element if ref is provided
    let unobserve = () => {};
    if (ref?.current) {
      unobserve = observeElement(ref.current);
    }

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      unobserve();
    };
  }, dependencies);

  useEffect(() => {
    // Clear interval on component unmount
    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, []);
};

export default useIntervalApiCall;
