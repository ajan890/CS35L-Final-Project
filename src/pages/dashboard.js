import React, {useEffect, useRef, useState} from "react";
import {getDocs, collection, updateDoc, doc, getDoc} from "firebase/firestore";

import {useEffectOnce} from "../utilities.js";

import {db, auth, getUser} from "../firebase/initFirebase.js";
import {active_bonus, getServerRequest, TakenRequest, MyRequest} from "./requestBoxes/requestBoxes"

import "./dashboard.css";
import {MyRequests} from "./requestBoxes/myRequests";
import {IconButton} from "@mui/material";
import {NavigateBefore, NavigateNext} from "@mui/icons-material";


function Dashboard() {
    const [takenRequests, setTakenRequests] = useState([])
    const takenRequestsRef = useRef();
    takenRequestsRef.current = takenRequests;

    let onClickDeleteTaken = (request) => {
        getServerRequest(request).then(function (result) {

            updateDoc(doc(db, "Requests", request.id), {
                status: "Not Taken", users_taken_this: [],
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
            
            //user cannot fulfilled orders that is deleted or fulfilled
            if (result.status === "Deleted") {
                alert("Someone else has deleted this order!");
                removeTakenRequest(request.id)
                return;
            } else if (result.status === "Fulfilled") {
                alert("The order has been delivered!");
                removeTakenRequest(request.id)
                return;
            }
            console.log(form_val)
            //verify pin
            if (pin !== form_val) {
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
                balance: user.balance, requests_taken: user.requests_taken, n_orders_fulfilled: user.n_orders_fulfilled,
            });
            alert("Sucessfully Fulfilled!");
        });
    }

    useEffectOnce(async () => {
        await getUser();
        const querySnapshot = await getDocs(collection(db, "Requests"));
        let newTakenRequests = []
        await querySnapshot.forEach((request) => {
            let request_data = request.data();
            if (!(request_data.status === "Fulfilled") && !(request_data.status === "Deleted")) {
                try {
                    if ((request_data.users_taken_this).includes(auth.currentUser.uid)) {
                        console.log("order status is: ", request_data.status);
                        console.log("this user " + auth.currentUser.uid + " has taken the order: " + request_data.id);
                        newTakenRequests.push(<TakenRequest request={request} key={request.id}
                                                            onClickFulfilled={onClickFulfilled}
                                                            onClickDelete={onClickDeleteTaken}/>)
                    }
                } catch (e) {
                    console.log("error:" + e);
                }
            }
        });

        if(newTakenRequests.length === 0) newTakenRequests.push(<div style={{flexGrow : "1",
            display : "flex", alignItems : "center", justifyContent : "center",
            fontSize : "2em", borderRadius : "1em", border: "dashed"}}>No requests</div>)

        setTakenRequests(newTakenRequests)
    });

    return (<div id="dashboardDiv">
            <img style={{position: "fixed", zIndex: -1, width: "100%", left: 0, top: 0}}
                 src={require("./images/sakura_trees - blur.jpg")}/>
            <div id="dashboardTop">
                <div>
                    <b style={{fontSize: "3em"}} id="header">Hello</b>
                </div>
                <div id="balance">You are this broke:</div>
                <div id="add-balance">
                    <a href="dashboard/addbalance">
                        <button className="button">Add balance</button>
                    </a>
                </div>
            </div>
            <div id={"dashboardContentDiv"}>
                <div style={{height: "1em"}}></div>
                <MyRequests/>
                <div>
                    <div style={{display : "flex", alignItems : "center", columnGap : "1em"}}>
                        <b style={{fontSize : "2em", }} id="second_title">Requests Taken</b>
                        <div style={{flexGrow : 1}}/>
                        <a href="/dashboard/requests">
                            <button className="button">Go to Requests</button>
                        </a>
                    </div>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <div>
                            <IconButton onClick={() => {
                                document.getElementById('requestsTaken').scrollBy({left: -500})
                            }}>
                                <NavigateBefore/>
                            </IconButton>
                        </div>
                        <div id="requestsTaken" className="scrollmenu">{takenRequests}</div>
                        <div>
                            <IconButton onClick={() => {
                                document.getElementById('myRequests').scrollBy({left: +500})
                            }}>
                                <NavigateNext/>
                            </IconButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
}

export default Dashboard