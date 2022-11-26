import { getDocs, updateDoc } from "firebase/firestore";
import { doc, collection } from "firebase/firestore";
import { useEffectOnce } from "../utilities.js";
import { db, auth } from "../firebase/initFirebase.js"
import {getUser}        from "./requests"
var requester; //person who wants to the order
var user;      // person who fullfills the order

function fullfill()
{
    return (
        <div>This is Home</div>
    );
}

export default Fullfill