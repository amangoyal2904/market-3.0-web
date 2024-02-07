import {useEffect, useState, useMemo} from 'react'

export function useIsInViewport(ref : any) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  
  useEffect(() => {
    if(ref.current){      
      const observer = new IntersectionObserver(([entry]) =>
            setIsIntersecting(entry.isIntersecting),
          );

      observer.observe(ref.current);

      return () => {        
        observer.disconnect();
      };
    }
  }, [ref]);

  return isIntersecting;
}