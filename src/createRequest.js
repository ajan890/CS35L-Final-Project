import React from "react"
import { doc, setDoc } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { db, auth } from "./firebase/initFirebase.js"

const labelStyle = { color: 'red', };  

function saveTags(tagsArray) {
    tagsArray.forEach(tag => {
        var toSave = tag.toLowerCase();
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
      id: id1
    });
  }

function onClickCreateRequest() {
    var sendRequest = true;
    var name = document.getElementById('name_textbox').value
    if (name == "") {
      sendRequest = false;
      document.getElementById('name_req_label').innerText = '* Required';
    }
    var desc = document.getElementById('desc_textbox').value
    if (desc == "") {
      sendRequest = false;
      document.getElementById('desc_req_label').innerText = '* Required';
    }
    var tagsString = document.getElementById('tags_textbox').value
    if (tagsString == "") {
      sendRequest = false;
      document.getElementById('tags_req_label').innerText = '* Required';
    } else {
      var tags = tagsString.split(',');
    }
    var bounty = document.getElementById('bounty_textbox').value
    if (bounty == "") {
      sendRequest = false;
      document.getElementById('bounty_req_label').innerText = '* Required';
    }
    var loc = document.getElementById('from_textbox').value
    //loc is not required.  If for example a client wants a roll of paper towels, they may not care where it came from
    var dest = document.getElementById('to_textbox').value
    if (dest == "") {
      sendRequest = false;
      document.getElementById('dest_req_label').innerText = '* Required';
    }
  
    if (sendRequest) {
      addRequest(name, desc, tags, bounty, auth.currentUser.uid, loc, dest);
      saveTags(tags);
      console.log(name);
      console.log(desc);
      console.log(tags);
      document.getElementById('name_req_label').innerText = '';
      document.getElementById('name_textbox').value = '';
      document.getElementById('desc_req_label').innerText = '';
      document.getElementById('desc_textbox').value = '';
      document.getElementById('tags_req_label').innerText = '';
      document.getElementById('tags_textbox').value = '';
      document.getElementById('bounty_req_label').innerText = '';
      document.getElementById('bounty_textbox').value = '';
      document.getElementById('dest_req_label').innerText = '';
      document.getElementById('from_textbox').value = '';
      document.getElementById('to_textbox').value = '';
      document.getElementById('field').style.color = "#00FF00";
      document.getElementById('field').innerText = 'Request Submitted! 😃';
      document.getElementById('name_textbox').height = 0;
    } else {
      document.getElementById('field').style.color = "#FF0000";
      document.getElementById('field').innerText = 'Please check your input.😭';
    }  
  }

class CreateRequest extends React.Component
{
    render(){
        const handleSubmit = event => {
            event.preventDefault();
            onClickCreateRequest();
          }
        return(
            <div className="wrapper">
                <h1>Submit Request</h1>
                <form onSubmit={handleSubmit}>
                <label>
                <div>
                    <a>Name: </a>
                    <input type="text" id="name_textbox"/> <label id="name_req_label" style={labelStyle}/>
                </div>
                <div>
                    <a>Description: </a>
                    <input type="text" id="desc_textbox"/> <label id="desc_req_label" style={labelStyle}/>
                </div>
                <div>
                    <a>Tags (separate with commas): </a>
                    <input type="text" id="tags_textbox"/> <label id="tags_req_label" style={labelStyle}/>
                </div>
                <div>
                    <a>Bounty: </a>
                    <input type="text" id="bounty_textbox"/> <label id="bounty_req_label" style={labelStyle}/>
                </div>
                <div>
                    <a>From (Which store or location do you want your product from?): </a>
                    <input type="text" id="from_textbox"/>
                </div>
                <div>
                    <a>Destination: </a>
                    <input type="text" id="to_textbox"/> <label id="dest_req_label" style={labelStyle}/>
                </div>
                </label>
                <button type="submit">Submit</button> <label id="field"/>
                <div>
                  <a href="./pages/requests">Return to Requests</a>
                </div>

            </form>
            </div>
        );
    }
}

export default CreateRequest