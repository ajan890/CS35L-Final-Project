import { getDocs, updateDoc } from "firebase/firestore";
import { doc, collection } from "firebase/firestore";
import { useEffectOnce } from "../utilities.js";
import { db, auth } from "../firebase/initFirebase.js"

var requests_taken; //person who wants to the order
var user;      // person who fullfills the order

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
  const authUID = auth.currentUser.uid;
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
    var form = document.createElement('form');
    //start of button
    var btn = document.createElement("button");
    btn.textContent = "Fullfill Order"
    btn.onclick = () => onClickTakeReq(data);
    title.innerText = data.title;
    desc.innerText = data.description;
    tags.innerText = data.tags;
    temp.appendChild(title);
    temp.appendChild(desc);
    temp.appendChild(tags);
    temp.appendChild(btn);
    temp.appendChild(form);

  return temp;
}

function printRequests(querySnapshot) {
  querySnapshot.forEach((request) => {
    //document.getElementById('requests').appendChild(formatRequest(request));
    console.log("Request User: " + request.data().user);
    console.log("Current User Login: " + auth.currentUser.uid);
    if (request.data().user === auth.currentUser.uid) {
      document.getElementById('myRequests').appendChild(formatRequest(request));
    }
  });

}

function testform()
{
  return(
    <div className="wrapper">
      <h1>My Requests</h1>
        <div id="myRequests" className="scrollmenu"></div>
    </div>
  )
}

function Fullfill()
{  
  useEffectOnce(getRequests);
  useEffectOnce(getUser);
  //getRequests();
    return (
        testform()

    );
}

export default Fullfill;