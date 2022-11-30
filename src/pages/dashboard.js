import { onAuthStateChanged } from "firebase/auth";
import React from "react";
import {auth} from "../firebase/initFirebase";
import { useEffectOnce } from "../utilities.js";
import {db} from "../firebase/initFirebase.js";
import {getDocs, collection, updateDoc, doc, getDoc} from "firebase/firestore";
import "./dashboard.css";
//var name = "";
var user = null;
var balance = null;

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

function formatRequest(request) {
  var data = request.data();
  var toReturn = formatRequestSub(request);
  var btn = document.createElement("button");
  btn.textContent = "Take this order";
  btn.onclick = () => onClickTakeReq(data);
  toReturn.appendChild(btn);
  return (toReturn);
}

function formatMyRequest(request) {
  var data = request.data();
  var toReturn = formatRequestSub(request);
  var pin = document.createElement('h5');
  pin.innerText = "Secret Pin: " + data.fulfill_pin;
  toReturn.appendChild(pin);
  //show the status of the order
  var req_stat = document.createElement('h5');
  req_stat.innerText = "Order status: " + data.status;
  toReturn.appendChild(req_stat);
  //delete button
  var delete_button = document.createElement("button");
  delete_button.textContent = "Delete this order";
  delete_button.onclick = () => onClickDelete(request);
  toReturn.appendChild(delete_button);
  return(toReturn);
}

function onClickDelete(request) {
  //fetch data from the server
  var request_data;
  getServerRequest(request).then(function(result) {
    request_data = (result);
    console.log(request_data);
    if (request.status === "Taken" || request.status === "Fulfilled") {
      alert("you cannot delete a order that has been taken or fulfilled!");
    }
    //update the request status
    request.status = "Deleted";
    updateDoc(doc(db, "Requests", request.id), {
      status: "Deleted",
    });
    //delete element at html myRequest
    var myRequests = document.getElementById("myRequests");
    console.log("myRequests are: ", myRequests);
    var children = myRequests.childNodes;
    var desire_child;
    for (var child in children) {
      if (children[child].id === request.id) {
        console.log("found the child");
        desire_child = children[child];
      }
    }
    myRequests.removeChild(desire_child);
  });
}

async function getServerRequest(request)
{
    var request_id = request.id;
    const docRef = doc(db, "Requests", request_id);
    const docSnap = await getDoc(docRef);
    var request_data = docSnap.data();
    return request_data;
}


function formatRequestTaken(request) {
  var toReturn = formatRequestSub(request);
  var deliver_loc = document.createElement('p');
  deliver_loc.innerText = "Delivery location: " + request.data().destination;
  toReturn.appendChild(deliver_loc);
  var form = document.createElement('input');
  form.value = "Enter 4 digits pin";
  var btn = document.createElement("button");
  btn.textContent = "Fulfill Order";
  btn.onclick = () => onClickFulfilled(request, form);
  toReturn.appendChild(form);
  toReturn.appendChild(btn);
  return toReturn;
}
function formatRequestSub(request) {
  var data = request.data();
  console.log("Format: " + data.description);
  var temp = document.createElement('a');
  var title = document.createElement('h2');
  var desc = document.createElement('p');
  var tags = document.createElement('p');
  var bounty = document.createElement('p');
  title.innerText = data.title;
  desc.innerText = "Description: " + data.description;
  tags.innerText = "Tags: " + data.tags;
  bounty.innerText = "Bounty: $" + data.bounty;
  temp.appendChild(title);
  temp.appendChild(desc);
  temp.appendChild(tags);
  temp.appendChild(bounty);
  temp.id = request.id;
  return temp;
}

//update the request status
function onClickFulfilled(request, form) {
  var id = request.id;
  var bounty = parseInt(request.data().bounty);
  var pin = request.data().fulfill_pin; 
  var form_val = Number(form.value);
  console.log("request id is: " + id + '\nrequest pin is: ' + pin);
  var userbal = user.balance;
  console.log("this is userbal: " + userbal);
  console.log("this is the bounty: " + bounty);
  console.log("Logged in user: " + user.UID);
  if (pin === form_val) {

    console.log(user.requests_taken);
    console.log(user.requests_taken.length);
    var remove_idx = -1;
    for (var i = 0; i < user.requests_taken; ++i) {
      if (user.requests_taken[i] === id) {
          remove_idx = i;
          break;
      }
    }
    console.log("remove idx is:" + remove_idx);
    user.requests_taken.splice(remove_idx, remove_idx + 1);
    console.log(user.requests_taken);
    user.n_orders_fulfilled = user.n_orders_fulfilled + 1;


    //update the local and remote data at the same time
    request.data().status = "Fulfilled";
    updateDoc(doc(db, "Requests", id), {
      status: "Fulfilled"
    });
    var allrequestsTaken = document.getElementById("requestsTaken");
    var children = allrequestsTaken.childNodes;
    var desire_child;
    for (var child in children) {
      if (children[child].id === request.id) {
        console.log("found the child");
        desire_child = children[child];
      }
    }
    allrequestsTaken.removeChild(desire_child)
    //FR2: calcualte the active bonus and update in server and page
    let bonus_active = active_bonus(user);
    console.log("active bonus is " + bonus_active);
    if (bonus_active > 0) {
      alert("Thank you for being active in the network. You are rewarded with $" + bonus_active + " in you balance.");
    }
    //update the balance for the bounty
    user.balance = Number(userbal + bounty + bonus_active); 
    user.balance = Math.round(user.balance * 100) / 100;
    document.getElementById("balance").innerHTML = "You are this broke: $" + user.balance;
    updateDoc(doc(db, "Users", user.UID), {
      balance: user.balance,
      requests_taken: user.requests_taken,
      n_orders_fulfilled : user.n_orders_fulfilled,
    });
    alert("Sucessfully Fulfilled!");
  } 
}

function active_bonus(user) {
  console.log("The number of order this user has taken is: " + user.n_orders_taken + "\n" +
    "the number of order this user has fulfilled is: " + user.n_orders_fulfilled);
  if (user.n_orders_fulfilled > 0 && user.n_orders_taken > 0 
    && user.n_orders_fulfilled % 3 === 0) {
      let fullfill_rate = user.n_orders_fulfilled / user.n_orders_taken;
      return (fullfill_rate + 1) * 0.015;
    }
  return 0;  
} 

async function getRequests() { 
  await getUser();
    const querySnapshot = await getDocs(collection(db, "Requests"));
    querySnapshot.forEach((request) => {
        var request_data = request.data();
        if (!(request_data.status === "Fulfilled") && !(request_data.status === "Deleted")) {
          if (request_data.user === auth.currentUser.uid) {
            document.getElementById('myRequests').appendChild(formatMyRequest(request));
          }
          //TODO: REMOVE TRY WHEN FINISHING THE PROJECT
          try {
            if ((request_data.users_taken_this).includes(auth.currentUser.uid)) {
              console.log("order status is: ", request_data.status);
              console.log("this user " + auth.currentUser.uid + " has taken the order: " + request_data.id);
              document.getElementById('requestsTaken').appendChild(formatRequestTaken(request));
            }
          } catch (e) {
            console.log("error:" + e);
          }
      }});
  }

onAuthStateChanged(auth, async (user) => {
    if(user) {
        //name = user.displayName
        await getBalance(user);
        user = user;
        if (document.getElementById("header") !== null) {
          document.getElementById("header").innerHTML = "Hello: " + user.displayName;
          document.getElementById("balance").innerHTML = "You are this broke: $" + Number(balance);
        }
    }
});

async function getBalance(user)
{
    var uid = user.uid;
    const docRef = doc(db, "Users", uid);
    const docSnap = await getDoc(docRef);
    balance = docSnap.data().balance;
    return balance
}


function Dashboard() {
    useEffectOnce(getRequests);
    useEffectOnce(getUser); 
    return( 
        <div>
            <div>
                <h1 id="header">Hello</h1>
            </div>
                <div id="balance">You are this broke:</div>
                <div id="add-balance">
                    <a href="dashboard/addbalance">
                        <button className="button">Add balance</button>
                    </a>
                </div>
            <div>
                <h2>My requests</h2>
                <div id="myRequests" className="scrollmenu"></div>
                <a href="dashboard/newrequest"> <button className="button">Submit Request</button> </a>
            </div>
            <div>
                <h2 id="second_title">Requests Taken</h2>
                <div id="requestsTaken" className="scrollmenu"></div>
                <a href="/dashboard/requests">
                  <button className="button">Go to Requests</button>
                </a>
            </div>
        </div>
    );
}

export default Dashboard