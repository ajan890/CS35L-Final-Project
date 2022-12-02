import React from "react";
import {useEffectOnce} from "../../utilities";
import {auth, db, getUser} from "../../firebase/initFirebase";
import {collection, doc, getDocs, updateDoc} from "firebase/firestore";
import {MyRequest, TakenRequest, getServerRequest} from "./requestBoxes";
import {useRef, useState} from "react";
import {IconButton} from "@mui/material";
import {NavigateBefore, NavigateNext} from "@mui/icons-material";

export function MyRequests(){
    const [requests, setRequests] = useState([])
    const requestsRef = useRef();
    requestsRef.current = requests;

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

    useEffectOnce(async () => {
        await getUser();
        const querySnapshot = await getDocs(collection(db, "Requests"));
        let newRequests = []
        await querySnapshot.forEach((request) => {
            let request_data = request.data();
            if (!(request_data.status === "Fulfilled") && !(request_data.status === "Deleted")) {
                if (request_data.user === auth.currentUser.uid) {
                    newRequests.push(<MyRequest request={request} key={request.id} onClickDelete={onClickDelete}/>)
                }
            }
        });

        if(newRequests.length === 0) newRequests.push(<div style={{flexGrow : "1", display : "flex",
            alignItems : "center", justifyContent : "center", fontSize : "2em",
            borderRadius : "1em", border: "dashed"}}>No requests</div>)

        setRequests(newRequests)
    });

    return (
        <div>
            <div style={{display : "flex", alignItems : "center", columnGap : "1em"}}>
                <b style={{fontSize : "2em", }}>My requests</b>
                <div style={{flexGrow : 1}}/>
                <a href="dashboard/newrequest">
                    <button className="button">Submit Request</button>
                </a>
            </div>
            <div style={{display : "flex", alignItems: "center", width: "100%"}}>
                <div>
                <IconButton onClick={() => {
                    document.getElementById('myRequests').scrollBy({left: -500})
                }}>
                    <NavigateBefore/>
                </IconButton>
                </div>
                <div id="myRequests" className="scrollmenu">{requests}</div>
                <div>
                <IconButton onClick={() => {
                    document.getElementById('myRequests').scrollBy({left: +500})
                }}>
                    <NavigateNext/>
                </IconButton>
                </div>
            </div>
        </div>
    )
}