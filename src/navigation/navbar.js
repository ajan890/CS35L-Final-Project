import React, {useEffect, useState} from 'react';
import {signOut} from "firebase/auth";

import {auth} from "../firebase/initFirebase";

// For navbar login widget

function signout()
{
    signOut(auth).then(() => {
    }).catch((error) => {
        console.log("err")
    });
}

function NavbarUserWidget () {

    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();

    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    if(user){
        console.log(user)
        return (
            <div>
                <button id="Signout" onClick={signout}>
                    Sign Out
                </button>
            </div>
        )
    }else{
        return <a href={'/login'}>Login</a>;
    }
}

export default function Navbar () {
    return (
        <div>
            <div id="leftNavBar">
                <a href={'/'}>Home</a>
            </div>
            <div id="rightNavBar">
                <NavbarUserWidget/>
            </div>

        </div>
    )
}