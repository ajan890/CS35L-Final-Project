import {getDocs, collection, updateDoc, doc, getDoc, query} from "firebase/firestore";
import {useEffectOnce} from "../utilities.js";
import {db, auth, getUser} from "../firebase/initFirebase.js"
import "./requests.css";
import {MyRequests} from "./requestBoxes/myRequests";
import React, {useRef, useState} from "react";
import {getServerRequest, MyRequest, TakenRequest, UntakenRequest} from "./requestBoxes/requestBoxes";
import {useEffect} from "react";
import {Autocomplete, TextField} from "@mui/material";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

function Requests() {
    const [requests, setRequests] = useState([])
    const [options, setOptions] = useState([])
    const requestsRef = useRef();
    requestsRef.current = requests;
    const [snapshot, setSnapshot]  = useState()
    const snapshotRef = useRef();
    snapshotRef.current = snapshot;

    function tagSearchChange(event, value) {
        searchRequests(snapshot, value);
    }

    const getTags = async result => {
        const tagQuery = query(collection(db, "Tags"));
        const allTags = await getDocs(tagQuery);
        let tagArray = [];
        allTags.forEach((tag) => {
            tagArray.push(tag.data().name);
        })
        setOptions(tagArray)
    }

    useEffect(() => {
        getTags()
    }, [])

    function searchRequests(querySnapshot, tag) {
        //repopulate
        let newRequests = []
        querySnapshot.forEach((request) => {
            var request_data = request.data();
            if (!(request_data.status === "Fulfilled") && !(request_data.status === "Deleted")) { //Do not display fulfilled orders
                if (tag === "") {
                    if (request_data.user === auth.currentUser.uid) {
                        newRequests.push(<MyRequest request={request} key={request.id} onClickDelete={onClickDelete}/>)
                    } else if ((request_data.users_taken_this).includes(auth.currentUser.uid)) {
                        newRequests.push(<TakenRequest request={request} key={request.id}
                                                       onClickDelete={onClickDeleteTaken}/>)
                    } else {
                        newRequests.push(<UntakenRequest request={request} key={request.id} onTakeOrder={onClickTakeReq}/>)
                    }
                } else {
                    var tags = request_data.tags;
                    var hasPart = false;
                    tags.forEach((t) => {
                        if (t.indexOf(tag) == 0) hasPart = true;
                    });
                    if (hasPart) {
                        if (request_data.user === auth.currentUser.uid) {
                            newRequests.push(<MyRequest request={request} key={request.id} onClickDelete={onClickDelete}/>)
                        } else if ((request_data.users_taken_this).includes(auth.currentUser.uid)) {
                            newRequests.push(<TakenRequest request={request} key={request.id}
                                                           onClickDelete={onClickDeleteTaken}/>)
                        } else {
                            newRequests.push(<UntakenRequest request={request} key={request.id} onTakeOrder={onClickTakeReq}/>)
                        }
                    }
                }
            }
        });
        setRequests(newRequests)
    }

    async function onClickTakeReq(request) {
        request = request.data()
        let user = await getUser()
        console.log("Taking request");
        let id = request.id;
        console.log(request);
        console.log("Request ID: " + id + " User: " + user.UID);
        console.log(requestsRef.current)
        let users_taken_this_new = request.users_taken_this;
        //avoid duplicate order taken and take the request of their own
        if (!users_taken_this_new.includes(user.UID) && !(request.user === user.UID)) {
            console.log("Taking request requirement is fulfilled");
            request.users_taken_this.push(user.UID);
            //update status and array
            updateDoc(doc(db, "Requests", id), {
                status: "Taken", users_taken_this: request.users_taken_this,
            });
            request.status = "Taken";
            user.requests_taken.push(id);
            user.n_orders_taken = user.n_orders_taken + 1;
            updateDoc(doc(db, "Users", user.UID), {
                requests_taken: user.requests_taken, n_orders_taken: user.n_orders_taken,
            }).then(() => {
                alert("Request Taken!");
                window.location.reload(false);
            })
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

    let onClickDeleteTaken = (request) => {
        request = request.data()
        getServerRequest(request).then(function (result) {
            let newUsersTaken = request.users_taken_this.filter((usr) => {
                return usr !== auth.currentUser.uid;
            })
            let newStatus = newUsersTaken.length === 0 ? request.status = "Not Taken" : request.status;
            updateDoc(doc(db, "Requests", request.id), {
                status: newStatus, users_taken_this: newUsersTaken
            }).then(() => {
                window.location.reload(false);
            });
        });
    }

    useEffectOnce(async () => {
        const querySnapshot = await getDocs(collection(db, "Requests"));
        setSnapshot(querySnapshot)
        let newRequests = []
        querySnapshot.forEach((request) => {
            var request_data = request.data();
            if (!(request_data.status === "Fulfilled") && !(request_data.status === "Deleted")) { //Do not display fulfilled orders
                if (request_data.user === auth.currentUser.uid) {
                    newRequests.push(<MyRequest request={request} key={request.id} onClickDelete={onClickDelete}/>)
                } else if ((request_data.users_taken_this).includes(auth.currentUser.uid)) {
                    newRequests.push(<TakenRequest request={request} key={request.id}
                                                   onClickDelete={onClickDeleteTaken}/>)
                } else {
                    newRequests.push(<UntakenRequest request={request} key={request.id} onTakeOrder={onClickTakeReq}/>)
                }
            }
        });
        setRequests(newRequests)
    });
    useEffectOnce(getUser);

    return (<div className="wrapper" id={"requestsPage"}>
        <b style={{fontSize : "3em"}} >Requests</b>
        <Autocomplete
            style={{width : "100%"}}
            disablePortal
            freeSolo
            id="combo-box-demo"
            options={options}
            sx={{width: "10em"}}
            renderInput={(params) => <TextField {...params} label="Tags"/>}
            onInputChange={tagSearchChange}
            fullWidth
        />

        <div id="requests">{requests}</div>
    </div>);
}


export default Requests