
/*
useEffectOnce from https://dev.to/ag-grid/react-18-avoiding-use-effect-getting-called-twice-4i9e
Code written by Niall Crosby
Used to prevent React from rendering async functions more than once
*/
//import { render } from "@testing-library/react";
import { useState, useEffect, useRef } from "react";
//import { withRouter } from "react-router";
//import { Link } from "react-router-dom";
//import { React } from "react";
import { collection } from "firebase/firestore";
import { query, where } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore, limit} from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDhVImrXhCHZzckmpPC0N4ZPacZKjTc0xI",
  authDomain: "cs35l-final-project-b0129.firebaseapp.com",
  databaseURL: "https://cs35l-final-project-b0129-default-rtdb.firebaseio.com",
  projectId: "cs35l-final-project-b0129",
  storageBucket: "cs35l-final-project-b0129.appspot.com",
  messagingSenderId: "265891179928",
  appId: "1:265891179928:web:642ee13badcbbd6f300fed",
  measurementId: "G-KBKX6H2ZL6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


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

//input1 is a str. Function returns first (up to) 10 tags that begin with input1 in an array.
export function getRecommendations(input1) {
  var input = input1.toLowerCase();
  const tagsRef = collection(db, "Tags");
  const tagArray = query(tagsRef, where("name" >= input), limit(10));
  return tagArray;
}
