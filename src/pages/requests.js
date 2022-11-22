import { initializeApp } from "firebase/app";
import { getDocs, getFirestore } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { useEffectOnce } from "../utilities.js";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const db = getFirestore(app);

//query
async function getRequests() {
  const querySnapshot = await getDocs(collection(db, "Requests"));
  var count = 0;
  querySnapshot.forEach((doc) => {
    console.log(count + doc.data().description);
    count++;
  });

  printRequests(querySnapshot);
}

function formatRequest(request) {
    var data = request.data();
    console.log("Format: " + data.description);
    var temp = document.createElement('a');
    var title = document.createElement('h2');
    var desc = document.createElement('p');
    var tags = document.createElement('p');
    title.innerText = data.title;
    desc.innerText = data.description;
    tags.innerText = data.tags;
    temp.appendChild(title);
    temp.appendChild(desc);
    temp.appendChild(tags);
  return temp;
}

function printRequests(querySnapshot) {
  querySnapshot.forEach((request) => {
    document.getElementById('requests').appendChild(formatRequest(request));
    console.log("Request User: " + request.data().user);
    console.log("Current User Login: " + getAuth().currentUser.uid);
    if (request.data().user === getAuth().currentUser.uid) {
      document.getElementById('myRequests').appendChild(formatRequest(request));
    }
  });

}

function testform()
{
  return(
    <div className="wrapper">
      <h1>Requests</h1> 
          <div id="requests" className="scrollmenu"></div>
      <h1>My Requests</h1>
        <div id="myRequests" className="scrollmenu"></div>
        <a href="./newrequest">
          <button>Submit Request</button>
        </a>
        
    </div>
  )
}

function Requests()
{  
  useEffectOnce(getRequests);
  //getRequests();
    return (
        testform()

    );
}


export default Requests