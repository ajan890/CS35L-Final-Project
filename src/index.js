import React from 'react';
import ReactDOM from 'react-dom/client';
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
