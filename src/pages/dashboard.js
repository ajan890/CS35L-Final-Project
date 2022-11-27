import { Outlet } from "react-router-dom";
import { onAuthStateChanged} from "firebase/auth";
import React from "react";
import {auth} from "../firebase/initFirebase";
import { useEffectOnce } from "../utilities.js";
import {db} from "../firebase/initFirebase.js";
import {getDocs, collection, updateDoc, doc} from "firebase/firestore";
var name = "";
var user;

function onClickTakeReq(request) {
    console.log("Taking request");
    var id = request.id;
    console.log(request);
    console.log("Request ID: " + id + " User: " + user.UID);
    var users_taken_this_new = request.users_taken_this;
    users_taken_this_new.push(user.UID);
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

function onClickFulfiled(request, form) {
    console.log("Checking pin");
    console.log(form.value);
    var id = request.id;
    console.log(request);
    console.log("Request ID: " + id + " User: " + user.UID);
  
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
    btn.textContent = "Fulfill Order";
    btn.onclick = () => onClickFulfilled(request, form);
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

async function getRequests() {
    const querySnapshot = await getDocs(collection(db, "Requests"));
    querySnapshot.forEach((request) => {
        if (request.data().user === auth.currentUser.uid) {
          document.getElementById('myRequests').appendChild(formatMyRequest(request));
          
        } 
        
        try {
          if ((request.data().users_taken_this).includes(auth.currentUser.uid)) {
            console.log("this user " + auth.currentUser.uid + " has taken the order: " + request.data().id);
            document.getElementById('requestsTaken').appendChild(formatRequestTaken(request));
          }
        } catch (e) {
          console.log("error:" + e);
        }
        
        //TODO
      });
  }

  
onAuthStateChanged(auth, (user) => {
    if(user) {
        name = user.displayName;
        document.getElementById("header").innerHTML = "Hello: " + name;
    }
});

function Dashboard() {
    useEffectOnce(getRequests);
    return( 
        <div id = "wrapper">
            <div>
                <h1 id="header">Hello</h1>
            </div>
            <div>
                <h2>My requests</h2>
                <div id="myRequests" className="scrollmenu"></div>
                <a href="./newrequest"> <button>Submit Request</button> </a>
            </div>
            <div>
                <h2>Requests Taken</h2>
                <div id="requestsTaken" className="scrollmenu"></div>
                <a href="./requests">
                  <button>Go to Requests</button>
                </a>
            </div>
        </div>
    );
}







export default Dashboard