import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from "react-router-dom";

import "./index.css";

import {router} from "./pages/reactRouter";
import Navbar from "./navigation/navbar"
import {doc} from "firebase/firestore";

//render the router
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
      <footer style={{padding : "1em", backgroundColor : "#0B0014", color : "#F5E9E2", flexGrow : 1, textAlign: "center"}}>
          CS35L Final Project © 2022 No Showers | No Rights Reserved | Contact: Joe Mama
      </footer>
  </React.StrictMode>
);

//render the navbar
ReactDOM.createRoot(document.getElementById("nav")).render(
  <Navbar/>
);
