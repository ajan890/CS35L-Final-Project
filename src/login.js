import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { doc, setDoc, getFirestore, collection, query, where, getCountFromServer, } from "firebase/firestore"; 
import { initializeApp } from 'firebase/app';

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
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);


async function isExistingUser(uid)
{
  const users = collection(db, "Users");
  const q = query(users, where("UID", "==", uid));
  const num = await getCountFromServer(q);
  if(num.data().count === 0)
  {
    return false;
  }
  else{
    return true;
  }
}

async function addNewUser(user)
{
  await setDoc(doc(db, "Users", user.uid), {
    balance: 0,
    email: user.email,
    name: user.displayName,
    phone: 6904206969,
    time_since_active: 0,
    UID: user.uid,
  });
}
onAuthStateChanged(auth, async (user) => {
  if(user) {
    const is = await isExistingUser(user.uid)
    if(is === 0)
    {
      addNewUser(user);
    }
  }
});
var uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
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