import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import { onAuthStateChanged } from "firebase/auth"
import { doc, setDoc, collection, query, where, getCountFromServer, } from "firebase/firestore";
import { db, auth } from "../firebase/initFirebase";
import { useEffectOnce } from '../utilities';

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
    // Terms of service url.
    tosUrl: '<your-tos-url>',
    // Privacy policy url.
    privacyPolicyUrl: '<your-privacy-policy-url>'
};

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
    requests_taken: [],
    n_requests_finished: 0,
    rewards: 0, 
    UID: user.uid,
  });
}
onAuthStateChanged(auth, async (user) => {
  if(user) {
    const is = await isExistingUser(user.uid)
    if(!is)
    {
      addNewUser(user);
    }
  }
});




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
      <div>
          This is Login
          <div id="firebaseui-auth-container"></div>
      </div>
    );
}

export default Login