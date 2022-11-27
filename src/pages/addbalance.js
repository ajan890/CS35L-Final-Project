import React from "react"
import { doc, setDoc, collection, query, where, getCountFromServer, getDoc, } from "firebase/firestore";
import { db, auth } from "../firebase/initFirebase";

class AddBalance extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            value: "",
            balance: null,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const amount = event.target.value;
        if (!amount || amount.match(/^\d{1,}(\.\d{0,2})?$/)) {
            this.setState(() => ({ value: amount }));
          }
    }

    async handleSubmit(event){
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
    render()
    {
        return(
            <form onSubmit={this.handleSubmit}>
                <label>
                    Enter amount:&nbsp;
                    <input type="text" value={this.state.value} required onChange={this.handleChange}/>
                </label>
                <input type="submit" value="Submit"></input>
            </form>
        );
    }
}

export default AddBalance