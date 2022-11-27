import { getDocs, updateDoc } from "firebase/firestore";
import { doc, collection } from "firebase/firestore";
import { useEffectOnce } from "../utilities.js";
import { db, auth } from "../firebase/initFirebase.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
  var users_taken_this_new = request.users_taken_this;
  //avoid duplicate order taken
  if (! users_taken_this_new.includes(user.UID)) {
    users_taken_this_new.push(user.UID);
  }
  //update
  updateDoc(doc(db, "Requests", id), {
    status: "Taken",
    users_taken_this: users_taken_this_new,
  });
  var newRequests = user.requests_taken;
  newRequests.push(id);
  updateDoc(doc(db, "Users", user.UID), {
    requests_taken: newRequests
  });

  //user.requests_taken.push(id);

}


//update the request status
function onClickFullfiled(request, form) {
  var id = request.id;
  //TODO: Verify pin is correct
  var pin = request.data().fulfill_pin; 
  var form_val = Number(form.value);
  console.log("request id is: " + id + 'request pin is: ' + pin);
  //console.log("form value is:" + form.value);
  //console.log("form casting number value is: " + form_val);
  //console.log("pin comparison: " + (pin === form_val));
  //console.log("pin entered is " + form)
  if (pin === form_val) {

  var newRequests = user.requests_taken;
  console.log(newRequests);
  console.log(newRequests.length);
  var remove_idx = -1;
  for (var i = 0; i < newRequests.length; ++i) {
    if (newRequests[i] === id) {
        remove_idx = i;
        break;
    }
  }
  console.log("remove idx is:" + remove_idx);
  newRequests.splice(remove_idx, remove_idx + 1);
  console.log(newRequests);
  updateDoc(doc(db, "Users", user.UID), {
    requests_taken: newRequests
  });

  updateDoc(doc(db, "Requests", id), {
    status: "Fullfilled"
  });
  //also need to update the request 
  } 
}

function formatRequest(request) {
    var data = request.data();
    console.log("Format: " + data.description);
    var temp = document.createElement('a');
    var title = document.createElement('h2');
    var desc = document.createElement('p');
    var tags = document.createElement('p');
    var btn = document.createElement("button");
    btn.textContent = "Take this order";
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

//request without the taking button
function formatMyRequest(request) {
  var data = request.data();
  console.log("Format: " + data.description);
  var temp = document.createElement('a');
  var title = document.createElement('h2');
  var desc = document.createElement('p');
  var tags = document.createElement('p');
  //var btn = document.createElement("button");
  //btn.style = {width:"125px", height:"25px"};
  //btn.onclick = () => onClickTakeReq(data);
  title.innerText = data.title;
  desc.innerText = data.description;
  tags.innerText = data.tags;
  temp.appendChild(title);
  temp.appendChild(desc);
  temp.appendChild(tags);
  //temp.appendChild(btn);

return temp;
}

function formatRequestTaken(request) {
    var data = request.data();
    console.log("Format: " + data.description);
    var temp = document.createElement('a');
    var title = document.createElement('h2');
    var desc = document.createElement('p');
    var tags = document.createElement('p');
    var form = document.createElement('input');
    form.value = "Enter 4 digits pin";
    
    //start of button
    var btn = document.createElement("button");
    btn.textContent = "Fullfill Order"
    btn.onclick = () => onClickFullfiled(request, form);
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
  querySnapshot.forEach((request) => {
    document.getElementById('requests').appendChild(formatRequest(request));
    console.log("Request User: " + request.data().user);
    console.log("Current User Login: " + auth.currentUser.uid);
    if (request.data().user === auth.currentUser.uid) {
      document.getElementById('myRequests').appendChild(formatMyRequest(request));
      
    } 
    
    try {
      if ((request.data().users_taken_this).includes(auth.currentUser.uid) && request.data().status !== "Fullfilled") {
        console.log("this user " + auth.currentUser.uid + " has taken the order: " + request.data().id);
        document.getElementById('myRequestTaken').appendChild(formatRequestTaken(request));
      }
    } catch (e) {
      console.log("error:" + e);
    }
    
    //TODO


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
      <h1>Request Taken</h1>
        <div id = "myRequestTaken" className="scrollmenu"></div>
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