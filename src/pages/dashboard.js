import React, {useEffect, useRef, useState} from "react";
import {getDocs, collection, updateDoc, doc, getDoc} from "firebase/firestore";

import {useEffectOnce} from "../utilities.js";

import {db, auth, getUser} from "../firebase/initFirebase.js";
import {active_bonus, getServerRequest, FormatRequestTaken, FormatMyRequest} from "./requestBoxes/dashboardRequestBox"

import "./dashboard.css";


function Dashboard() {
    const [requests, setRequests] = useState([])
    const requestsRef = useRef();
    requestsRef.current = requests;
    const [takenRequests, setTakenRequests] = useState([])
    const takenRequestsRef = useRef();
    takenRequestsRef.current = takenRequests;

    let onClickDelete = (request) => {
        getServerRequest(request).then(function (result) {
            if (result.status === "Taken" || result.status === "Fulfilled") {
                alert("you cannot delete a order that has been taken or fulfilled!");
                return;
            }
            request.status = "Deleted";
            updateDoc(doc(db, "Requests", request.id), {
                status: "Deleted",
            });
            //delete element at html myRequest
            setRequests(requestsRef.current.filter((rq) => {
                return rq.key !== request.id
            }))
        });
    }

    let onClickDeleteTaken = (request) => {
        getServerRequest(request).then(function (result) {
            request.status = "Not Taken";
            updateDoc(doc(db, "Requests", request.id), {
                status: "Not Taken",
                users_taken_this: []
            });
            //delete element at html myRequest
            setTakenRequests(takenRequestsRef.current.filter((rq) => {
                return rq.key !== request.id
            }))
        });
    }

    async function onClickFulfilled(request, form) {
        let removeTakenRequest = (id) => {
            setTakenRequests(takenRequestsRef.current.filter((rq) => {
                return rq.key !== id
            }))
        }

        let user = await getUser()

        let id = request.id;
        let bounty = parseInt(request.data().bounty);
        let pin = request.data().fulfill_pin;
        let form_val = form;
        console.log("request id is: " + id + '\nrequest pin is: ' + pin);
        let userbal = user.balance;
        console.log("this is userbal: " + userbal);
        console.log("this is the bounty: " + bounty);
        console.log("Logged in user: " + user.UID);

        getServerRequest(request).then(function (result) {
            request.data().status = request.status;
            //user cannot fulfilled orders that is deleted or fulfilled
            if (request.status === "Deleted") {
                alert("Someone else has deleted this order!");
                removeTakenRequest(request.id)
                return;
            } else if (request.status === "Fulfilled") {
                alert("Another person has delivered this order!");
                removeTakenRequest(request.id)
                return;
            }

            console.log(form_val)
            //verify pin
            if (pin !== form_val){
                alert("Your pin is incorrect");
                return;
            }

            console.log(user.requests_taken);
            console.log(user.requests_taken.length);
            let remove_idx = -1;
            for (let i = 0; i < user.requests_taken; ++i) {
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
            removeTakenRequest(request.id)
            //FR2: calcualte the active bonus and update in server and page
            let bonus_active = active_bonus(user, request);
            console.log("active bonus is " + bonus_active);
            if (bonus_active > 0) {
                alert("Thank you for being active in the network. You are rewarded with $" + Math.round(bonus_active * 100) / 100 + " in you balance.");
            }
            //update the balance for the bounty
            user.balance = Number(userbal + bounty + bonus_active);
            user.balance = Math.round(user.balance * 100) / 100;
            document.getElementById("balance").innerHTML = "You are this broke: $" + user.balance;
            updateDoc(doc(db, "Users", user.UID), {
                balance: user.balance,
                requests_taken: user.requests_taken,
                n_orders_fulfilled: user.n_orders_fulfilled,
            });
            alert("Sucessfully Fulfilled!");
        });
    }

    useEffectOnce(async () => {
        await getUser();
        const querySnapshot = await getDocs(collection(db, "Requests"));
        let newRequests = []
        let newTakenRequests = []
        await querySnapshot.forEach((request) => {
            let request_data = request.data();
            if (!(request_data.status === "Fulfilled") && !(request_data.status === "Deleted")) {
                if (request_data.user === auth.currentUser.uid) {
                    newRequests.push(<FormatMyRequest request={request} key={request.id} onClickDelete={onClickDelete}/>)
                }
                try {
                    if ((request_data.users_taken_this).includes(auth.currentUser.uid)) {
                        console.log("order status is: ", request_data.status);
                        console.log("this user " + auth.currentUser.uid + " has taken the order: " + request_data.id);
                        newTakenRequests.push(<FormatRequestTaken request={request} key={request.id} onClickFulfilled={onClickFulfilled} onClickDelete={onClickDeleteTaken}/>)
                    }
                } catch (e) {
                    console.log("error:" + e);
                }
            }
        });

        setRequests(newRequests)
        setTakenRequests(newTakenRequests)
    });

    return (
        <div className="wrapper">
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
                <div id="myRequests" className="scrollmenu">{requests}</div>
                <a href="dashboard/newrequest">
                    <button className="button">Submit Request</button>
                </a>
            </div>
            <div>
                <h2 id="second_title">Requests Taken</h2>
                <div id="requestsTaken" className="scrollmenu">{takenRequests}</div>
                <a href="/dashboard/requests">
                    <button className="button">Go to Requests</button>
                </a>
            </div>
        </div>
    );
}

export default Dashboard