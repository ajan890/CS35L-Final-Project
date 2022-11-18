import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDocs, getFirestore, QueryDocumentSnapshot } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import { useEffectOnce } from "./singleEffect.js";
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
const analytics = getAnalytics(app);
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

function addRequest(name, desc, tagsArray) {
  //name, description = strings, tags = string[]
  setDoc(doc(db, "Requests", name), {
    title: name,
    description: desc,
    tags: tagsArray
  });
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

function printRequests(querySnapshot, user) {
  querySnapshot = 
  querySnapshot.forEach((request) => {
    document.getElementById('requests').appendChild(formatRequest(request));
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
    var tags = tagsString.split(' ');
  }
  if (sendRequest) {
    addRequest(name, desc, tags);
    console.log(name);
    console.log(desc);
    console.log(tags);
    document.getElementById('name_req_label').innerText = '';
    document.getElementById('desc_req_label').innerText = '';
    document.getElementById('tags_req_label').innerText = '';
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
        <div>
          <div id="requests" className="scrollmenu">
            
          </div>
        </div>
      <h1>Submit Request</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <div>
            <input type="text" id="name_textbox"/> <label id="name_req_label" style={labelStyle}/>
          </div>
          <div>
            <input type="text" id="desc_textbox"/> <label id="desc_req_label" style={labelStyle}/>
          </div>
          <div>
            <input type="text" id="tags_textbox"/> <label id="tags_req_label" style={labelStyle}/>
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
    return (
        testform()

    );
}


export default Requests