import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from "react-router-dom";

import "./index.css";

import {router} from "./pages/reactRouter";
import Navbar from "./navigation/navbar"

//render the router
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

//render the navbar
ReactDOM.createRoot(document.getElementById("nav")).render(
  <Navbar/>
);
