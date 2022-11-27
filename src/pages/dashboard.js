import { Outlet } from "react-router-dom";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import React from "react";
const auth = getAuth();
var name = "";
onAuthStateChanged(auth, (user) => {
    if(user) {
        name = user.displayName;
        document.getElementById("header").innerHTML = "Hello: " + name;
    }
});
class Dashboard extends React.Component
{
    
    componentDidMount() {
        document.getElementById("header").innerHTML = "Hello: " + name;
    }

    render(){
        return(
            <div id = "wrapper">
                <div id="header">Hello</div>
                <Outlet />
            </div>
        );
    }
}

export default Dashboard