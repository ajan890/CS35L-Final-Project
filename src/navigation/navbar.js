import React, {useEffect, useState} from 'react';
import {signOut} from "firebase/auth";
import "./navbar.css"

import {Avatar, Button} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';

import {auth} from "../firebase/initFirebase";

const theme = createTheme({
    palette: {
        primary: {
            main: '#ffffff',
        },
        secondary: {
            main: '#11cb5f',
        },
    },
});

// For navbar login widget

function signout()
{
    signOut(auth).then(() => {
    }).catch((error) => {
        console.log("err")
    });
}

function toLogin(){
    window.location.href = '/login'
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
                <Button
                    disableRipple
                    variant="text"
                    color="primary"
                >
                    Welcome {user.displayName}
                    <div style={{marginRight : '1em'}}/>
                    <Avatar src={'http://www.wpsimplesponsorships.com/wp-content/uploads/2019/05/cropped-icon-256x256.png'}/>
                </Button>
            </div>
        )
    }else{
        return (
            <ThemeProvider theme={theme}>
                <Button disableRipple color="primary" variant="outlined" onClick={toLogin}>
                    <span><b>Sign Up</b> or <b>Log In</b></span>
                </Button>
            </ThemeProvider>
        )
    }
}

export default function Navbar () {
    return (
        <div id="navbar">
            <div id="leftNavBar">
                <input
                    onClick={() => {window.location.href = '/'}}
                    id="logo"
                    type="image"
                    src="https://placekitten.com/120/30"
                />
            </div>
            <div id="centerNavBar"/>
            <div id="rightNavBar">
                <NavbarUserWidget/>
            </div>

        </div>
    )
}