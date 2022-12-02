import {createBrowserRouter} from "react-router-dom";
import Home from "./home";
import Login from "./login";
import Dashboard from "./dashboard";
import Requests from "./requests";
import CreateRequest from "./createRequest";
import AddBalance from "./addbalance"
import ErrorPage from "./404";

//page navigation tree
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
    },
    {
        path: "/dashboard/requests",
        element: <Requests />,
    },
    {
        path: "/dashboard/newrequest",
        element: <CreateRequest />,
    },
    {
        path: "/dashboard/addbalance",
        element: <AddBalance />,
    },
    {
        path: "*",
        element: <ErrorPage />,
    }
]);

export {router}