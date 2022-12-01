import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import { onAuthStateChanged } from "firebase/auth"
import { doc, setDoc, collection, query, where, getCountFromServer, } from "firebase/firestore";
import { db, auth } from "../firebase/initFirebase";
import { useEffectOnce } from '../utilities';
import "./login.css"

//configuration for the UI
var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            return true;
        },
        uiShown: function() {
            // The widget is rendered.
            // Hide the loader.
            // document.getElementById('loader').style.display = 'none';
        }
    },
    signInSuccessUrl: '/dashboard',
    signInOptions: [
        {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: true,
        }
    ],
};

//checks if the user is new to the database
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

//adds new users to the database
async function addNewUser(user)
{
  await setDoc(doc(db, "Users", user.uid), {
    balance: 0,
    email: user.email,
    name: user.displayName,
    phone: 6904206969,
    n_orders_fulfilled: 0,
    n_orders_taken: 0,
    time_since_active: 0,
    requests_taken: [],
    UID: user.uid,
  });
}

//when someone logs in check if they exist in the database
onAuthStateChanged(auth, async (user) => {
  if(user) {
    const is = await isExistingUser(user.uid)
    if(!is)
    {
      await addNewUser(user);
    } 
  }
});

//start the login UI
function startLogin() {
    if(firebaseui.auth.AuthUI.getInstance()) {
        const ui = firebaseui.auth.AuthUI.getInstance();
        ui.start('#firebaseui-auth-container', uiConfig);
    } else {
        const ui = new firebaseui.auth.AuthUI(auth)
        ui.start('#firebaseui-auth-container', uiConfig)
    }
}

function Login()
{
  useEffectOnce(startLogin);
    return(
      <div id="background">
          <div id="firebaseui-auth-container"></div>
      </div>
    );
}

export default Login