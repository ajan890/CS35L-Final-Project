import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import {initializeApp} from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyDhVImrXhCHZzckmpPC0N4ZPacZKjTc0xI",
    authDomain: "cs35l-final-project-b0129.firebaseapp.com",
    databaseURL: "https://cs35l-final-project-b0129-default-rtdb.firebaseio.com",
    projectId: "cs35l-final-project-b0129",
    storageBucket: "cs35l-final-project-b0129.appspot.com",
    messagingSenderId: "265891179928",
    appId: "1:265891179928:web:642ee13badcbbd6f300fed",
    measurementId: "G-KBKX6H2ZL6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function startLogin() {
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', {
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID
        ]
    });
}

function Login()
{
    return(
    <div>
        This is Login
        <button onClick={startLogin}>Login</button>
        <div id="firebaseui-auth-container"></div>
    </div>
    );
}

export default Login