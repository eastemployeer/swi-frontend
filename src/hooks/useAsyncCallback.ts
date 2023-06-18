import { DependencyList, useCallback, useEffect, useRef, useState } from "react";

export default function useAsyncCallback<T extends(...args: any[]) => Promise<any>>(callback: T, deps: DependencyList) {
  const [loading, setLoading] = useState(false);
  const mounted = useRef(false);
  
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  
  const wrapped = useCallback(async (...args: any[]) => {
    try {
      if(mounted.current) setLoading(true);
      
      return await callback(...args);
    } finally {
      if(mounted.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps) as T;
  
  return [wrapped, loading] as const;
}
