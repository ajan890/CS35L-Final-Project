import { initializeApp } from "firebase/app";
import { getDocs, getFirestore, updateDoc } from "firebase/firestore";
import { doc, collection } from "firebase/firestore";
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
var user;

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

async function getUser() {
  const users = await getDocs(collection(db, "Users"));
  const authUID = getAuth().currentUser.uid;
  console.log("AUTH ID: " + authUID);
  users.forEach((userIter) => {
    console.log(userIter.data().UID);
    if (userIter.data().UID === authUID) {
      user = userIter.data();
    }
  });
  console.log("1USER: " + user.UID);
}

function onClickTakeReq(request) {
  console.log("Taking request");
  var id = request.id;
  console.log(request);
  console.log("Request ID: " + id + " User: " + user.UID);
  updateDoc(doc(db, "Requests", id), {
    status: "Taken"
  });
  var newRequests = user.requests_taken;
  newRequests.push(id)
  updateDoc(doc(db, "Users", user.UID), {
    requests_taken: newRequests
  });

  //user.requests_taken.push(id);

}

function formatRequest(request) {
    var data = request.data();
    console.log("Format: " + data.description);
    var temp = document.createElement('a');
    var title = document.createElement('h2');
    var desc = document.createElement('p');
    var tags = document.createElement('p');
    var btn = document.createElement("button");
    //btn.style = {width:"125px", height:"25px"};
    btn.onclick = () => onClickTakeReq(data);
    title.innerText = data.title;
    desc.innerText = data.description;
    tags.innerText = data.tags;
    temp.appendChild(title);
    temp.appendChild(desc);
    temp.appendChild(tags);
    temp.appendChild(btn);

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
  useEffectOnce(getUser);
  //getRequests();
    return (
        testform()

    );
}


export default Requests