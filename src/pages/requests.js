import {getDocs, collection, updateDoc, doc, getDoc} from "firebase/firestore";
import {useEffectOnce} from "../utilities.js";
import {db, auth, getUser} from "../firebase/initFirebase.js"
import "./requests.css";
import {MyRequests} from "./requestBoxes/myRequests";
import React, {useRef, useState} from "react";
import {getServerRequest, MyRequest, UntakenRequest} from "./requestBoxes/requestBoxes";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// function searchRequests(querySnapshot, tag) {
//     //first, clear all child nodes
//     while (document.getElementById('requests').firstChild) {
//         document.getElementById('requests').removeChild(document.getElementById('requests').firstChild);
//     }
//     //repopulate
//     querySnapshot.forEach((request) => {
//         var request_data = request.data();
//         if (!(request_data.status === "Fulfilled") && !(request_data.status === "Deleted")) { //Do not display fulfilled orders
//             if (tag === "") {
//                 document.getElementById('requests').appendChild(formatRequest(request));
//             } else {
//                 var tags = request_data.tags;
//                 var hasPart = false;
//                 tags.forEach((t) => {
//                     if (t.indexOf(tag) == 0) hasPart = true;
//                 });
//                 if (hasPart) document.getElementById('requests').appendChild(formatRequest(request));
//             }
//         }
//     });
// }

// function tagSearchChange(event) {
//     const value = event.target.value;
//     searchRequests(requestSnapshot, value);
// }

function Requests() {
    const [requests, setRequests] = useState([])
    const requestsRef = useRef();
    requestsRef.current = requests;

    async function onClickTakeReq(request) {
        let user = await getUser()
        console.log("Taking request");
        let id = request.id;
        console.log(request);
        console.log("Request ID: " + id + " User: " + user.UID);
        let users_taken_this_new = request.users_taken_this;
        //avoid duplicate order taken and take the request of their own
        if (!users_taken_this_new.includes(user.UID) && !(request.user === user.UID)) {
            console.log("Taking request requirement is fulfilled");
            request.users_taken_this.push(user.UID);
            //request.users_taken_this.push(user.UID);
            //update status and array
            updateDoc(doc(db, "Requests", id), {
                status: "Taken", users_taken_this: request.users_taken_this,
            });
            request.status = "Taken";
            user.requests_taken.push(id);
            user.n_orders_taken = user.n_orders_taken + 1;
            updateDoc(doc(db, "Users", user.UID), {
                requests_taken: user.requests_taken, n_orders_taken: user.n_orders_taken,
            });
            alert("Request Taken!");
        }
    }

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

    useEffectOnce(async() => {
        const querySnapshot = await getDocs(collection(db, "Requests"));
        let newRequests = []
        querySnapshot.forEach((request) => {
            var request_data = request.data();
            if (!(request_data.status === "Fulfilled") && !(request_data.status === "Deleted")) { //Do not display fulfilled orders
                if (request_data.user === auth.currentUser.uid) {
                    newRequests.push(<MyRequest request={request} key={request.id} onClickDelete={onClickDelete}/>)
                }else{
                    newRequests.push(<UntakenRequest request={request} key={request.id} onTakeOrder={onClickTakeReq}/>)
                }
            }
        });
        setRequests(newRequests)
    });
    useEffectOnce(getUser);

    return (<div className="wrapper">
        <h1>Requests</h1>
        {/*<div>*/}
        {/*    <a>Search by tags: </a><input type='text' id='tag_search' onChange={tagSearchChange}></input>*/}
        {/*</div>*/}

        <div id="requests">{requests}</div>
        <div>
            <a href="../dashboard">Return to Dashboard</a>
        </div>
    </div>);
}


export default Requests