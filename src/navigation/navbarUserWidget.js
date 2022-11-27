import React, {useEffect, useState} from "react";

import {auth} from "../firebase/initFirebase";
import {signOut} from "firebase/auth";

import { createTheme } from '@mui/material/styles';
import {Avatar, Button, Menu, MenuItem} from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";

// For navbar login widget

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

function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(name) {
    let letters = '';
    name.split(' ').every((word) => {
        letters += word[0];
        if(letters.length >= 2) return false;
        return true;
    })

    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${letters}`,
    };
}

function userMenu () {

}

export default function NavbarUserWidget () {

    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();

    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    useEffect(() => {
        const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    if(user){
        console.log(user)
        return (
            <div
                style={{display : 'flex',
                    columnGap : '1.3em',
                    alignItems: 'center',
                }}
            >
                <div style={{
                    fontSize: '1.4em',
                    lineHeight: '1em',
                }}>
                    {user.displayName}
                </div>
                <Avatar
                    {...stringAvatar(user.displayName)}
                    style={{
                        border: '0.1em solid white'
                    }}
                    onClick={handleClick}
                    sx={{ height : "1.5em", width : "1.5em", fontSize : '1.1em'}}
                />
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={() => {setAnchorEl(null);}}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            mt: 1,
                            ml: -1
                        },
                    }}
                >
                    <MenuItem onClick={() => {
                        setAnchorEl(null);
                        document.location.href = '/dashboard'
                    }}>
                        Dashboard
                    </MenuItem>
                    <MenuItem onClick={() => {
                            setAnchorEl(null);
                            signout();
                        }}
                    >
                        Sign Out
                    </MenuItem>
                </Menu>
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