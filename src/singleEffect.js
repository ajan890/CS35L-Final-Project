
/*
from https://dev.to/ag-grid/react-18-avoiding-use-effect-getting-called-twice-4i9e
Code written by Niall Crosby
Used to prevent React from rendering async functions more than once
*/
import { useState, useEffect, useRef } from "react";

export const useEffectOnce = ( effect )=> {

    const destroyFunc = useRef();
    const effectCalled = useRef(false);
    const renderAfterCalled = useRef(false);
    const [val, setVal] = useState(0);
  
    if (effectCalled.current) {
        renderAfterCalled.current = true;
    }
  
    useEffect( ()=> {
  
        // only execute the effect first time around
        if (!effectCalled.current) { 
          destroyFunc.current = effect();
          effectCalled.current = true;
        }
  
        // this forces one render after the effect is run
        setVal(val => val + 1);
  
        return ()=> {
          // if the comp didn't render since the useEffect was called,
          // we know it's the dummy React cycle
          if (!renderAfterCalled.current) { return; }
          if (destroyFunc.current) { destroyFunc.current(); }
        };
    }, []);
  };
  