import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { doc, setDoc, getFirestore, collection, query, where, getCountFromServer, } from "firebase/firestore";
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
            document.getElementById('loader').style.display = 'none';
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
    var ui = new firebaseui.auth.AuthUI(getAuth());
    ui.start('#firebaseui-auth-container', uiConfig);
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