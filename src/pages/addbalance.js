import React from "react"
import {doc, setDoc, collection, query, where, getCountFromServer, getDoc,} from "firebase/firestore";
import {db, auth} from "../firebase/initFirebase";
import {Autocomplete, IconButton, TextField} from "@mui/material";
import {Close} from "@mui/icons-material";

class AddBalance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "", balance: null,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const amount = event.target.value;
        if (!amount || amount.match(/^\d{1,}(\.\d{0,2})?$/)) {
            this.setState(() => ({value: amount}));
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        this.state.balance = +(this.state.value);
        var user = auth.currentUser
        var uid = user.uid;
        const docRef = doc(db, "Users", uid);
        const docSnap = await getDoc(docRef);
        this.state.balance += docSnap.data().balance;
        await setDoc(docRef, {balance: this.state.balance}, {merge: true});
        window.location = "/dashboard";
    }

    render() {
        return (<div className="wrapper">
                <div id="request_form">
                    <form id="requestForm">
                        <div id="requestUpper">
                            <b style={{fontSize: "2em"}}>Add Balance</b>
                            <div style={{flexGrow: "1"}}/>
                            <IconButton onClick={() => {
                                window.location.href = "/dashboard"
                            }}>
                                <Close/>
                            </IconButton>
                        </div>
                        <div id="requestLower">
                            <b>FOR SAFETY REASONS REAL MONEY IS NOT USED IN THIS APPLICATION</b>
                            <TextField onChange={this.handleChange} label={"Enter amount"} type={"number"} name={"Enter amount"} value={this.state.value} required/>
                            <button id="button" onClick={this.handleSubmit} style={{margin: "auto"}}>Submit</button>
                        </div>
                    </form>
                </div>
            </div>);
    }
}

export default AddBalance