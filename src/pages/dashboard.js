import { Outlet } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import React from "react";
import {auth} from "../firebase/initFirebase";
import { useEffectOnce } from "../utilities.js";
import {db} from "../firebase/initFirebase.js";
import {getDocs, collection, updateDoc, doc, getDoc} from "firebase/firestore";
import "./dashboard.css";
var name = "";
var user = null;
var balance = null;
var state = false;
//var fullfill_button_idx = 0; //use to remember idx of fullfill button

// User will not take order at dashboard
// function onClickTakeReq(request) {
//     console.log("Taking request");
//     var id = request.id;
//     console.log(request);
//     console.log("Request ID: " + id + " User: " + user.UID);
//     var users_taken_this_new = request.users_taken_this;
//     users_taken_this_new.push(user.UID);
//     updateDoc(doc(db, "Requests", id), {
//       status: "Taken",
//       users_taken_this: users_taken_this_new,
//     });
//     var newRequests = user.requests_taken;
//     newRequests.push(id);
//     updateDoc(doc(db, "Users", user.UID), {
//       requests_taken: newRequests
//     });
  
//     //user.requests_taken.push(id);
  
//   }

// No longer needs this function on dashboard
// function formatRequest(request) {
//     var data = request.data();
//     console.log("Format: " + data.description);
//     var temp = document.createElement('a');
//     var title = document.createElement('h2');
//     var desc = document.createElement('p');
//     var tags = document.createElement('p');
//     var btn = document.createElement("button");
//     btn.textContent = "Take this order";
//     //btn.style = {width:"125px", height:"25px"};
//     btn.onclick = () => onClickTakeReq(data);
//     title.innerText = data.title;
//     desc.innerText = data.description;
//     tags.innerText = data.tags;
//     temp.appendChild(title);
//     temp.appendChild(desc);
//     temp.appendChild(tags);
//     temp.appendChild(btn);

//   return temp;
// }

//request without the taking button
function formatMyRequest(request) {
  var data = request.data();
  console.log("Format: " + data.description);
  var temp = document.createElement('a');
  var title = document.createElement('h2');
  var desc = document.createElement('p');
  var tags = document.createElement('p');
  var bounty = document.createElement('p');
  var fulfill_pin = document.createElement('h5');
  //var btn = document.createElement("button");
  //btn.style = {width:"125px", height:"25px"};
  //btn.onclick = () => onClickTakeReq(data);
  title.innerText = data.title;
  desc.innerText = "Description: " + data.description;
  tags.innerText = "Tags: " + data.tags;
  bounty.innerText = "Bounty: $" + data.bounty;
  fulfill_pin.innerText = "Secret Pin: " + data.fulfill_pin;
  temp.appendChild(title);
  temp.appendChild(desc);
  temp.appendChild(tags);
  temp.appendChild(bounty);
  temp.appendChild(fulfill_pin);
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

//update the request status
function onClickFullfiled(request, form) {
  var id = request.id;
  var bounty = parseInt(request.data().bounty);
  var pin = request.data().fulfill_pin; 
  var form_val = Number(form.value);
  console.log("request id is: " + id + '\nrequest pin is: ' + pin);
  //console.log("form value is:" + form.value);
  //console.log("form casting number value is: " + form_val);
  //console.log("pin comparison: " + (pin === form_val));
  //console.log("pin entered is " + form)
  var userbal = user.balance;
  console.log("this is userbal: " + userbal);
  console.log("this is the bounty: " + bounty);
  console.log("Logged in user: " + user.UID);
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
    user.n_orders_fullfilled = user.n_orders_fullfilled + 1


    //update the local and remote data at the same time
    request.data().status = "Fullfilled";
    updateDoc(doc(db, "Requests", id), {
      status: "Fullfilled"
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
      requests_taken: newRequests,
      n_orders_fullfilled : user.n_orders_fullfilled,
    });
    alert("Sucessfully Fulfilled!");
  } 
}

function active_bonus(user) {
  console.log("The number of order this user has taken is: " + user.n_orders_taken + "\n" +
    "the number of order this user has fullfilled is: " + user.n_orders_fullfilled);
  if (user.n_orders_fullfilled > 0 && user.n_orders_taken > 0 
    && user.n_orders_fullfilled % 3 === 0) {
      let fullfill_rate = user.n_orders_fullfilled / user.n_orders_taken;
      return (fullfill_rate + 1) * 0.015;
    }
  return 0;  
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
    btn.textContent = "Fulfill Order";
    btn.onclick = () => onClickFullfiled(request, form);
    title.innerText = data.title;
    desc.innerText = "Description: " + data.description;
    tags.innerText = "Tags: " + data.tags;
    bounty.innerText = "Bounty: $" + data.bounty;
    temp.appendChild(title);
    temp.appendChild(desc);
    temp.appendChild(tags);
    temp.appendChild(bounty);
    temp.appendChild(form);
    temp.appendChild(btn);
    temp.id = request.id; 
  return temp;
}

async function getRequests() { 
  await getUser();
    const querySnapshot = await getDocs(collection(db, "Requests"));
    querySnapshot.forEach((request) => {
        var request_data = request.data();
        if (!(request_data.status === "Fullfilled")) {
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
        name = user.displayName
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
                <a href="./dashboard/newrequest"> <button className="button">Submit Request</button> </a>
            </div>
            <div>
                <h2 id="second_title">Requests Taken</h2>
                <div id="requestsTaken" className="scrollmenu"></div>
                <a href="./dashboard/requests">
                  <button className="button">Go to Requests</button>
                </a>
            </div>
        </div>
    );
}


export default Dashboard