import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Requests from "./requests.js"
import Login from "./login.js"
import Home from "./home.js"
import Dashboard from "./dashboard.js"
import "./index.css"

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
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "/dashboard/requests",
        element: <Requests />,
      }
    ]

  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById("nav")).render(
  <div>
    <li>
      <a href={'/login'}>Login</a>
    </li>
    <li>
      <a href={'/dashboard/requests'}>Requests</a>
    </li>
    <li>
      <a href={'/'}>Home</a>
    </li>
    <li>
      <a href={'/dashboard'}>Dashboard</a>
    </li>
  </div>
  
);
