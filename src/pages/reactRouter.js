import {createBrowserRouter} from "react-router-dom";
import Home from "./home";
import Login from "./login";
import Dashboard from "./dashboard";
import Requests from "./requests";
import CreateRequest from "../createRequest";

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
            },
            {
                path: "/dashboard/newrequest",
                element: <CreateRequest />,
            }
        ]

    },
]);

export {router}