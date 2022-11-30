import "./navbar.css"
import NavbarUserWidget from "./navbarUserWidget";
import {auth} from "../firebase/initFirebase";
import {useEffect, useState} from "react";

export default function Navbar () {

    // Check if logged in

    const [user, setUser] = useState();

    function onAuthStateChanged(user) {
        setUser(user);
    }

    useEffect(() => {
        const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    let homeHref = user ? "/dashboard" : "/"

    return (
        <div id="navbar">
            <div id="leftNavBar">
                <input
                    onClick={() => {window.location.href = homeHref}}
                    id="logo"
                    type="image"
                    src={require("./images/logoWithName.png")}
                />
            </div>
            <div id="centerNavBar"/>
            <div id="rightNavBar">
                <NavbarUserWidget/>
            </div>

        </div>
    )
}