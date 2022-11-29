import { getDocs, updateDoc } from "firebase/firestore";
import { doc, collection } from "firebase/firestore";
import { useEffectOnce } from "../utilities.js";
import { db, auth } from "../firebase/initFirebase.js"
import { buttonGroupClasses } from "@mui/material";
import "./requests.css";
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
  //avoid duplicate order taken and take the request of their own
  if (! users_taken_this_new.includes(user.UID) && !(request.user === user.UID)) {
    console.log("Taking request requirement is fulfilled");
    request.users_taken_this.push(user.UID);
    //request.users_taken_this.push(user.UID);
    //update status and array
    updateDoc(doc(db, "Requests", id), {
      status: "Taken",
      users_taken_this: request.users_taken_this,
    });
    request.status = "Taken";
    user.requests_taken.push(id);
    user.n_orders_taken = user.n_orders_taken + 1;
    updateDoc(doc(db, "Users", user.UID), {
      requests_taken: user.requests_taken,
      n_orders_taken: user.n_orders_taken,
    });
    //window.location = "/dashboard/requests";
    alert("Request Taken!");
  }
}


//update the request status
// function onClickFullfiled(request, form) {
//   var id = request.id;
//   //TODO: Verify pin is correct
//   var pin = request.data().fulfill_pin; 
//   var form_val = Number(form.value);
//   console.log("request id is: " + id + 'request pin is: ' + pin);
//   //console.log("form value is:" + form.value);
//   //console.log("form casting number value is: " + form_val);
//   //console.log("pin comparison: " + (pin === form_val));
//   //console.log("pin entered is " + form)
//   if (pin === form_val) {

//   var newRequests = user.requests_taken;
//   console.log(newRequests);
//   console.log(newRequests.length);
//   var remove_idx = -1;
//   for (var i = 0; i < newRequests.length; ++i) {
//     if (newRequests[i] === id) {
//         remove_idx = i;
//         break;
//     }
//   }
//   console.log("remove idx is:" + remove_idx);
//   newRequests.splice(remove_idx, remove_idx + 1);
//   console.log(newRequests);
//   updateDoc(doc(db, "Users", user.UID), {
//     requests_taken: newRequests
//   });

//   updateDoc(doc(db, "Requests", id), {
//     status: "Fullfilled"
//   });
//   //also need to update the request taken

//   } 
// }

function formatRequest(request) {
    var data = request.data();
    console.log("Format: " + data.description);
    var temp = document.createElement('a');
    var title = document.createElement('h2');
    var desc = document.createElement('p');
    var tags = document.createElement('p');
    var bounty = document.createElement('p');
    var btn = document.createElement("button");

    btn.textContent = "Take this order";
    //btn.style = {width:"125px", height:"25px"};
    btn.onclick = () => onClickTakeReq(data);
    title.innerText = data.title;
    desc.innerText = "Description: " + data.description;
    tags.innerText = "Tags: " + data.tags;
    bounty.innerText = "Bounty: $" + data.bounty;
    temp.appendChild(title);
    temp.appendChild(desc);
    temp.appendChild(tags);
    temp.appendChild(bounty);
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
  var bounty = document.createElement('p');
  //var btn = document.createElement("button");
  //btn.style = {width:"125px", height:"25px"};
  //btn.onclick = () => onClickTakeReq(data);
  title.innerText = data.title;
  desc.innerText = "Description: " + data.description;
  tags.innerText = "Tags: " + data.tags;
  bounty.innerText = "Bounty: $" + data.bounty;
  temp.appendChild(title);
  temp.appendChild(desc);
  temp.appendChild(tags);
  temp.appendChild(bounty);
  //temp.appendChild(btn);

return temp;
}

function onClickFulfilled(request, form) {
  console.log("Checking pin");
  console.log(form.value);
  var id = request.id;
  console.log(request);
  //console.log("Request ID: " + id + " User: " + user.UID);

  //TODO: Verify pin is correct

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
}

function printRequests(querySnapshot) {
  querySnapshot.forEach((request) => {
    var request_data = request.data(); 
    if (!(request_data.status === "Fullfilled")) { //Do not display fullfilled orders
    document.getElementById('requests').appendChild(formatRequest(request));
    console.log("Request User: " + request_data.user);
    console.log("Current User Login: " + auth.currentUser.uid);
    if (request_data.user === auth.currentUser.uid) {
      document.getElementById('myRequests').appendChild(formatMyRequest(request));
      
    }  
    try {
      if ((request_data.users_taken_this).includes(auth.currentUser.uid)) {
        console.log("this user " + auth.currentUser.uid + " has taken the order: " + request.data().id);
        document.getElementById('myRequestTaken').appendChild(formatRequestTaken(request));
      }
    } catch (e) {
      console.log("error:" + e);
    }
    
    //TODO
  }});
}

function formatRequestTaken(request) {
  var data = request.data();
  console.log("Format: " + data.description);
  var temp = document.createElement('a');
  var title = document.createElement('h2');
  var desc = document.createElement('p');
  var tags = document.createElement('p');
  var bounty = document.createElement('p');
  var form = document.createElement('input');
  form.value = "Enter 4 digits pin";

  //start of button
  var btn = document.createElement("button");
  btn.textContent = "Fullfill Order"
  btn.onclick = () => onClickFulfilled(request, form);
  title.innerText = data.title;
  desc.innerText = data.description;
  tags.innerText = data.tags;
  bounty.innerText = "Bounty: $" + data.bounty;
  temp.appendChild(title);
  temp.appendChild(desc);
  temp.appendChild(tags);
  temp.appendChild(bounty);
  temp.appendChild(form);
  temp.appendChild(btn);
return temp;
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
          <button id="button">Submit Request</button>
        </a>
        <div>
          <a href="../dashboard">Return to Dashboard</a>
        </div>
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