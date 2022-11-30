import React, {useEffect, useState} from "react"
import {doc, setDoc, getDoc, getDocs} from "firebase/firestore";
import {collection, query, where, limit} from "firebase/firestore";
import {Timestamp} from "firebase/firestore";
import {db, auth} from "../firebase/initFirebase.js"
import {Autocomplete, Chip, IconButton, TextField} from "@mui/material";
import {Close} from "@mui/icons-material";
import "./createRequest.css";

function saveTags(tagsArray) {
    tagsArray.forEach(tag => {
        var toSave = tag.toLowerCase();
        toSave = toSave.trim();
        setDoc(doc(db, "Tags", toSave), {
            name: toSave
        });
    });
}

function addRequest(name, desc, tagsArray, bounty1, userID, from, to) {
    //name, description = strings, tags = string[]
    const id1 = (+new Date).toString(36)
    setDoc(doc(db, "Requests", id1), {
        status: "Not Taken", //can either be "Not Taken," "Taken," "Filled"
        time_submitted: Timestamp.now(),
        fulfill_pin: Math.floor((Math.random() * 9000) + 1000),
        title: name,
        description: desc,
        from: from,
        destination: to,
        bounty: bounty1,
        tags: tagsArray,
        user: userID,
        id: id1,
        users_taken_this: [],
    });
}

async function balcheck(bounty) {
    var uid = auth.currentUser.uid;
    const docRef = doc(db, "Users", uid);
    const docSnap = await getDoc(docRef);
    var balance = docSnap.data().balance;
    if (bounty > balance) {
        alert("YOU'RE BROKE");
        return false;
    } else if (bounty <= 0) {
        alert("The bounty must be greater than 0!");
        return false;
    } else{
        await setDoc(docRef, {balance: balance - bounty}, {merge: true});
        return true;
    }
}

async function onClickCreateRequest(data) {
    if ((await balcheck(data.bounty)) && document.getElementById("requestForm").checkValidity()) {
        saveTags(data.tags)
        addRequest(data.title, data.description, data.tags, data.bounty, auth.currentUser.uid, data.location, data.destination);
        alert("Request Submitted! 😃'")
    } else {
        alert('Please check your input.😭');
    }
}

const defaultValues = {
    title: "",
    description: "",
    tags: [],
    location: "",
    destination: "",
    bounty: 0
};


function CreateRequest(){
    const [options, setOptions] = useState([])
    const [tags, setTags] = useState([])
    const [chips, setChips] = useState([])

    const [formValues, setFormValues] = useState(defaultValues)

    const getTags = async result => {
        const tagQuery = query(collection(db, "Tags"));
        const allTags = await getDocs(tagQuery);
        let tagArray = [];
        allTags.forEach((tag) => {
            tagArray.push(tag.data().name);
        })
        setOptions(tagArray)
    }

    const convertTagsToChips = () => {
        let newChips = []
        tags.forEach((tag) => {
            newChips.push(
                <Chip
                    label={tag}
                    onDelete={() => {
                        let newTagList = tags.filter(item => item !== tag)
                        setTags(newTagList)
                    }}
                />
            )
        })
        setChips(newChips)
    }

    useEffect(() => {
        getTags()
    }, [])

    useEffect(() => {
        convertTagsToChips()
    })

    const handleSubmit = async event => {
        event.preventDefault()
        let submissionData = {
            ...formValues,
            tags: tags
        }
        await onClickCreateRequest(submissionData);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    return (
        <div className="wrapper">
            <div id="request_form">
                <form id="requestForm">
                    <div id="requestUpper">
                        <b style={{fontSize: "2em"}}>Submit a request</b>
                        <div style={{flexGrow: "1"}}/>
                        <IconButton onClick={() => {window.location.href = "/dashboard"}}>
                            <Close/>
                        </IconButton>
                    </div>
                    <div id="requestLower">
                        <TextField name="title" id="name" label="Title" variant="filled" required sx={{width : "50%"}} onChange={handleInputChange}/>
                        <div id="tagElement">
                            <Autocomplete
                                disablePortal
                                freeSolo
                                id="combo-box-demo"
                                options={options}
                                sx={{width: "10em"}}
                                renderInput={(params) => <TextField {...params} label="Tags" size="small"/>}
                                onChange={(event, val) => {
                                    val = val.trim()
                                    if(val === "") return
                                    let newTagList = tags
                                    if(!tags.includes(val)) {
                                        newTagList.push(val)
                                        setTags(newTagList)
                                    }
                                }}
                            />
                            {chips}
                        </div>
                        <TextField id="description" label="Description" multiline variant="outlined" minRows="5"
                                   fullWidth required onChange={handleInputChange} name={"description"}/>
                        <div style={{display : "flex"}}>
                            <TextField size={"small"} label={"Store/Location"} onChange={handleInputChange} name={"location"} required/>
                            <div style={{flexGrow : "1"}}/>
                            <TextField size={"small"} label={"Destination"} onChange={handleInputChange} name={"destination"} required/>
                        </div>
                        <TextField label={"Bounty"} type={"number"} onChange={handleInputChange} name={"bounty"} required/>
                    </div>
                </form>

                <button id="button" onClick={handleSubmit} style={{margin: "0em 0em 2em 2em"}}>Submit</button>
            </div>
        </div>
    );
}

export default CreateRequest





//input1 is a str. Function returns first (up to) 10 tags that begin with input1 in an array.
async function getRecommendations(input1) {
    var input = input1.toLowerCase();
    const tagQuery = query(collection(db, "Tags"), where("name", ">=", input), limit(10));
    const snapshot = await getDocs(tagQuery);
    var tagArray = [];
    snapshot.forEach((item) => {
        tagArray.push(item.data().name);
    });

    for (var i = tagArray.length - 1; i >= 0; i--) {
        if (tagArray[i].indexOf(input) != 0) {
            tagArray.splice(i, 1);
        }
    }
    console.log("Array: " + tagArray);
    return tagArray;
}