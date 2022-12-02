import React, {useState} from "react";
import {doc, getDoc} from "firebase/firestore";
import {auth, db} from "../../firebase/initFirebase";
import {onAuthStateChanged} from "firebase/auth";
import {Button, Chip, IconButton, TextField} from "@mui/material";
import {useEffectOnce} from "../../utilities";
import {Close} from "@mui/icons-material";

import "./requestBoxes.css"
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {} from "@mui/material/colors";

let balance = ""

const theme = createTheme({
    palette: {
        primary: {
            light: "#FFFFFF",
            main: "#FFFFFF",
            dark: "#FFFFFF",
            contrastText: "#FFFFFF",
        },
        secondary: {
            light: "#FFFFFF",
            main: "#FFFFFF",
            dark: "#FFFFFF",
            contrastText: "#FFFFFF",
        },
        text: {
            light: "#FFFFFF",
            main: "#FFFFFF",
            dark: "#FFFFFF",
            contrastText: "#FFFFFF",
        },
        info: {
            light: "#FFFFFF",
            main: "#FFFFFF",
            dark: "#FFFFFF",
            contrastText: "#FFFFFF",
        },
    },
});

export function active_bonus(user, request) {
    console.log("The number of order this user has taken is: " + user.n_orders_taken + "\n" +
        "the number of order this user has fulfilled is: " + user.n_orders_fulfilled);
    let base_rate = 0.02;
    let rate_based_on_req = Math.min(0.015, 0.001 * user.n_orders_fulfilled);
    if (user.n_orders_fulfilled > 0 && user.n_orders_taken > 0) {
        console.log(base_rate + rate_based_on_req);
        console.log(request.data().bounty);
        return (base_rate + rate_based_on_req) * Number(request.data().bounty);
    }
    return 0;
}

onAuthStateChanged(auth, async (user) => {
    if (user) {
        //name = user.displayName
        await getBalance(user);
        user = user;
        if (document.getElementById("header") !== null) {
            document.getElementById("header").innerHTML = "Hello: " + user.displayName;
            document.getElementById("balance").innerHTML = "You are this broke: $" + Number(balance);
        }
    }
});

async function getBalance(user) {
    var uid = user.uid;
    const docRef = doc(db, "Users", uid);
    const docSnap = await getDoc(docRef);
    balance = docSnap.data().balance;
    return balance
}

export async function getServerRequest(request) {
    var request_id = request.id;
    const docRef = doc(db, "Requests", request_id);
    const docSnap = await getDoc(docRef);
    var request_data = docSnap.data();
    return request_data;
}

export function MyRequest(props) {
    let data = props.request.data();
    const [chips, setChips] = useState([])

    const convertTagsToChips = () => {
        let newChips = []
        data.tags.forEach((tag) => {
            newChips.push(
                <Chip
                    label={tag}
                    key={tag}
                />
            )
        })
        setChips(newChips)
    }

    useEffectOnce(() => {
        convertTagsToChips()
    })

    return (
        <div className={"requestInfo"} id={props.request.id}>
            <div id="requestBoxUpper">
                <div id="requestBoxUpperTop">
                    <div style={{display : "flex", alignItems : "center", borderStyle : "solid", height : "auto", padding : "0em 1em", borderRadius : "1em"}}>
                        <b style={{fontSize: "2em"}}>{"$" + data.bounty}</b>
                    </div>
                    <div style={{minWidth: 0, flexShrink: 2, display: "flex", flexDirection: "column"}}>
                        <b style={{width : "100%", fontSize: "2em", textOverflow: "ellipsis", overflow: "hidden"}}>{data.title}</b>
                        <div style={{width : "100%", minHeight : "2em", overflowX : "hidden"}}>{chips}</div>
                    </div>
                    <div style={{flexGrow : 1}}></div>
                    <div>
                        <IconButton onClick={() => {props.onClickDelete(props.request)}}>
                            <Close/>
                        </IconButton>
                    </div>
                </div>
            </div>
            <div id="requestBoxLower">
                <TextField id="description" label="Description" multiline variant="outlined" minRows="5"
                           fullWidth name={"description"} value={data.description} disabled/>
                <div style={{display : "flex", marginTop : "1em", columnGap : "2em"}}>
                    <TextField size={"small"} label={"Store/Location"} name={"location"} disabled value={data.from}/>
                    <div style={{flexGrow : "1"}}/>
                    <TextField size={"small"} label={"Destination"} name={"destination"} disabled value={data.destination}/>
                </div>
            </div>
            <div id="requestBoxBottom">
                <div style={{border : "solid", borderRadius : "1em", padding : "0em 1em"}}>
                    <b>Order status: </b>
                    {data.status}
                </div>
                <div style={{flexGrow : "1"}}/>
                <div style={{border : "solid", borderRadius : "1em", padding : "0em 1em"}}>
                    <b>Secret Pin: </b>
                    {data.fulfill_pin}
                </div>
            </div>
        </div>
    );
}

export function TakenRequest(props) {
    let data = props.request.data();
    const [pin, setPin] = useState(0)
    const [chips, setChips] = useState([])

    const convertTagsToChips = () => {
        let newChips = []
        data.tags.forEach((tag) => {
            newChips.push(
                <Chip
                    label={tag}
                    key={tag}
                />
            )
        })
        setChips(newChips)
    }

    useEffectOnce(() => {
        convertTagsToChips()
    })

    return (
        <div className={"requestInfo"} id={props.request.id}>
            <div id="requestBoxUpper">
                <div id="requestBoxUpperTop">
                    <div style={{display : "flex", alignItems : "center", borderStyle : "solid", height : "auto", padding : "0em 1em", borderRadius : "1em"}}>
                        <b style={{fontSize: "2em"}}>{"$" + data.bounty}</b>
                    </div>
                    <div style={{minWidth: 0, flexShrink: 2, display: "flex", flexDirection: "column"}}>
                        <b style={{width : "100%", fontSize: "2em", textOverflow: "ellipsis", overflow: "hidden"}}>{data.title}</b>
                        <div style={{width : "100%", minHeight : "2em", overflowX : "hidden"}}>{chips}</div>
                    </div>
                    <div style={{flexGrow : 1}}></div>
                    <div>
                        <IconButton onClick={() => {props.onClickDelete(props.request)}}>
                            <Close/>
                        </IconButton>
                    </div>
                </div>
            </div>
            <div id="requestBoxLower">
                <TextField id="description" label="Description" multiline variant="outlined" minRows="5"
                           fullWidth name={"description"} value={data.description} disabled/>
                <div style={{display : "flex", marginTop : "1em", columnGap : "2em"}}>
                    <TextField size={"small"} label={"Store/Location"} name={"location"} disabled value={data.from}/>
                    <div style={{flexGrow : "1"}}/>
                    <TextField size={"small"} label={"Destination"} name={"destination"} disabled value={data.destination}/>
                </div>
            </div>
            <ThemeProvider theme={theme}>
                <div id="requestBoxBottom" style={{justifyContent: "center"}}>
                    <TextField sx={{ input: { color: 'white' } }} focused size="small" type={"number"} label={"Enter 4 digits pin"} onChange={(e) => {setPin(e.target.valueAsNumber)}}/>
                    <Button variant="outlined" onClick={() => {
                        props.onClickFulfilled(props.request, pin)
                    }}>
                        Fulfill Order
                    </Button>
                </div>
            </ThemeProvider>
        </div>
    );
}

export function UntakenRequest(props) {
    let data = props.request.data();
    const [chips, setChips] = useState([])

    const convertTagsToChips = () => {
        let newChips = []
        data.tags.forEach((tag) => {
            newChips.push(
                <Chip
                    label={tag}
                    key={tag}
                />
            )
        })
        setChips(newChips)
    }

    useEffectOnce(() => {
        convertTagsToChips()
    })

    return (
        <div className={"requestInfo"} id={props.request.id}>
            <div id="requestBoxUpper">
                <div id="requestBoxUpperTop">
                    <div style={{display : "flex", alignItems : "center", borderStyle : "solid", height : "auto", padding : "0em 1em", borderRadius : "1em"}}>
                        <b style={{fontSize: "2em"}}>{"$" + data.bounty}</b>
                    </div>
                    <div style={{minWidth: 0, flexShrink: 2, display: "flex", flexDirection: "column"}}>
                        <b style={{width : "100%", fontSize: "2em", textOverflow: "ellipsis", overflow: "hidden"}}>{data.title}</b>
                        <div style={{width : "100%", minHeight : "2em", overflowX : "hidden"}}>{chips}</div>
                    </div>
                    <div style={{flexGrow : 1}}></div>
                </div>
            </div>
            <div id="requestBoxLower">
                <TextField id="description" label="Description" multiline variant="outlined" minRows="5"
                           fullWidth name={"description"} value={data.description} disabled/>
                <div style={{display : "flex", marginTop : "1em", columnGap : "2em"}}>
                    <TextField size={"small"} label={"Store/Location"} name={"location"} disabled value={data.from}/>
                    <div style={{flexGrow : "1"}}/>
                    <TextField size={"small"} label={"Destination"} name={"destination"} disabled value={data.destination}/>
                </div>
            </div>
            <div id="requestBoxBottom">
                <ThemeProvider theme={theme}>
                    <Button variant={"outlined"} onClick={() => {props.onTakeOrder(props.request)}} style={{margin : "auto"}}>Take this order</Button>
                </ThemeProvider>
            </div>
        </div>
    );
}