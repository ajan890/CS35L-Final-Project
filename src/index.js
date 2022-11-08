import React from 'react';
import ReactDOM from 'react-dom/client';
<<<<<<< Updated upstream
import './index.css';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDocs, getFirestore } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
const analytics = getAnalytics(app);
const db = getFirestore(app);

//query
const querySnapshot = await getDocs(collection(db, "Users"));
querySnapshot.forEach((doc) => {
  console.log(doc.data());
});

//write
function addRequest(name, ) {

}


=======
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import { Link } from 'react-router-dom';
import Login from "./login.js"
import Home from "./home.js"
import Requests from "./requests.js"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/requests",
    element: <Requests />,
  },
]);

ReactDOM.createRoot(document.getElementById("nav")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <div>
    <li>
      <a href={'/login'}>Login</a>
    </li>
    <li>
      <a href={'/requests'}>Requests</a>
    </li>
    <li>
      <a href={'/'}>Home</a>
    </li>
  </div>
  
);
>>>>>>> Stashed changes
