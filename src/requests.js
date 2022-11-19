import { initializeApp } from "firebase/app";
import { getDocs, getFirestore } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import { useEffectOnce } from "./singleEffect.js";
import { getAuth } from "firebase/auth";
import { Timestamp } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDhVImrXhCHZzckmpPC0N4ZPacZKjTc0xI",
  authDomain: "cs35l-final-project-b0129.firebaseapp.com",
  databaseURL: "https://cs35l-final-project-b0129-default-rtdb.firebaseio.com",
  projectId: "cs35l-final-project-b0129",
  storageBucket: "cs35l-final-project-b0129.appspot.com",
  messagingSenderId: "265891179928",
  appId: "1:265891179928:web:642ee13badcbbd6f300fed",
  measurementId: "G-KBKX6H2ZL6"
};

const labelStyle = {
  color: 'red',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//query
async function getRequests() {
  const querySnapshot = await getDocs(collection(db, "Requests"));
  var count = 0;
  querySnapshot.forEach((doc) => {
    console.log(count + doc.data().description);
    count++;
  });

  printRequests(querySnapshot);
}

function formatRequest(request) {
    var data = request.data();
    console.log("Format: " + data.description);
    var temp = document.createElement('a');
    var title = document.createElement('h2');
    var desc = document.createElement('p');
    var tags = document.createElement('p');
    title.innerText = data.title;
    desc.innerText = data.description;
    tags.innerText = data.tags;
    temp.appendChild(title);
    temp.appendChild(desc);
    temp.appendChild(tags);
  return temp;
}

function printRequests(querySnapshot) {
  querySnapshot.forEach((request) => {
    document.getElementById('requests').appendChild(formatRequest(request));
    console.log("Request User: " + request.data().user);
    console.log("Current User Login: " + getAuth().currentUser.uid);
    if (request.data().user === getAuth().currentUser.uid) {
      document.getElementById('myRequests').appendChild(formatRequest(request));
    }
  });

}

function addRequest(name, desc, tagsArray, bounty1, userID, from, to) {
  //name, description = strings, tags = string[]
  setDoc(doc(db, "Requests", (+new Date).toString(36)), {
    status: "Not Taken", //can either be "Not Taken," "Taken," "Filled"
    time_submitted: Timestamp.now(),
    fulfill_pin: Math.floor((Math.random() * 9000) + 1000),
    title: name,
    description: desc,
    from: from,
    destination: to,
    bounty: bounty1,
    tags: tagsArray,
    user: userID
  });
}

function onClick() {
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
    addRequest(name, desc, tags, bounty, getAuth().currentUser.uid, loc, dest);
    console.log(name);
    console.log(desc);
    console.log(tags);
    document.getElementById('name_req_label').innerText = '';
    document.getElementById('desc_req_label').innerText = '';
    document.getElementById('tags_req_label').innerText = '';
    document.getElementById('bounty_req_label').innerText = '';
    document.getElementById('dest_req_label').innerText = '';
    document.getElementById('field').style.color = "#00FF00";
    document.getElementById('field').innerText = 'Request Submitted! 😃';
  } else {
    document.getElementById('field').style.color = "#FF0000";
    document.getElementById('field').innerText = 'Please check your input.😭';
  }

  //print request submitted

}

function testform()
{
  const handleSubmit = event => {
    event.preventDefault();
    onClick();
  }
  return(
    <div className="wrapper">
      <h1>Requests</h1> 
          <div id="requests" className="scrollmenu"></div>
      <h1>My Requests</h1>
        <div id="myRequests" className="scrollmenu"></div>
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
        <button type="submit">Submit</button>
        <div>
          <p id="field"/>
        </div>
      </form>
      <div>
        
      </div>
    </div>
  )
}

function Requests()
{  
  useEffectOnce(getRequests);
  //getRequests();
    return (
        testform()

    );
}


export default Requests