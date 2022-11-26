import { getDocs, updateDoc } from "firebase/firestore";
import { doc, collection } from "firebase/firestore";
import { useEffectOnce } from "../utilities.js";
import { db, auth } from "../firebase/initFirebase.js"

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

function getRequestTake(user) {
   return user.requests_taken;
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

function onClickTakeReq(request,form) {
  console.log("Checking pin");
  console.log(form.value);
  var id = request.id;
  console.log(request);
  console.log("Request ID: " + id + " User: " + user.UID);
  updateDoc(doc(db, "Requests", id), {
    status: "Fullfilled"
  });
  var newRequests = user.requests_taken;

  var remove_idx = -1;
  for (var i = 0; i < newRequests.length; ++i) {
    if (newRequests[i] === id) {
        remove_idx = i;
        break;
    }
  }
  console.log("remove idx is:" + remove_idx);
  newRequests = newRequests.splice(remove_idx, remove_idx + 1);
  updateDoc(doc(db, "Users", user.UID), {
    requests_taken: newRequests
  });

  //getRequests();

  //user.requests_taken.push(id);
}


function formatRequest(request) {
    var data = request.data();
    console.log("Format: " + data.description);
    var temp = document.createElement('a');
    var title = document.createElement('h2');
    var desc = document.createElement('p');
    var tags = document.createElement('p');
    var form = document.createElement('input');
    form.value = "Enter 6 digits pin";
    
    //start of button
    var btn = document.createElement("button");
    btn.textContent = "Fullfill Order"
    btn.onclick = () => onClickTakeReq(request, form);
    title.innerText = data.title;
    desc.innerText = data.description;
    tags.innerText = data.tags;
    temp.appendChild(title);
    temp.appendChild(desc);
    temp.appendChild(tags);
    temp.appendChild(form);
    temp.appendChild(btn);
    

  return temp;
}

function printRequests(querySnapshot) {
  querySnapshot.forEach((request, Users) => {
    //document.getElementById('requests').appendChild(formatRequest(request));
    console.log("Request User: " + request.data().user);
    console.log("Current User Login: " + auth.currentUser.uid);
   
    var requests_taken = getRequestTake(auth.currentUser);
    console.log(requests_taken);
    if (requests_taken.include(request.data().id)) {
       document.getElementById('myTakenRequests').appendChild(formatRequest(request));
    }
  });

}

function testform()
{
  return(
    <div className="wrapper">
      <h1>My Requests</h1>
        <div id="myTakenRequests" className="scrollmenu"></div>
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