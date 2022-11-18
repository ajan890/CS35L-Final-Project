import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import { getAuth } from "firebase/auth"
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
var uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        return true;
      },
      uiShown: function() {
        // The widget is rendered.
        // Hide the loader.
        document.getElementById('loader').style.display = 'none';
      }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: '/dashboard',
    signInOptions: [
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: true,
      }
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>',
    // Privacy policy url.
    privacyPolicyUrl: '<your-privacy-policy-url>'
  };


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function startLogin() {
    var ui = new firebaseui.auth.AuthUI(getAuth());
    ui.start('#firebaseui-auth-container', uiConfig);
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