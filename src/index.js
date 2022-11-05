import React from 'react';
import ReactDOM from 'react-dom/client';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDocs, getFirestore } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<h1>Hello World!</h1>);


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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

//query
// const querySnapshot = await getDocs(collection(db, "Users"));
// querySnapshot.forEach((doc) => {
//   console.log(doc.data());
// });

function addRequest(name, desc, tagsArray, bounty, userID) {
  //name, description = strings, tags = string[]
  var hash = (new Date().getTime()).toString(36);
  setDoc(doc(db, "Requests", hash), {
    title: name,
    description: desc,
    tags: tagsArray,
    bounty: bounty,
    user: userID
  });
}

function requestButtonOnClick() { //rename this method if necessary.
  //get user ID that submitted the order
  var name = document.getElementById('name_textbox').value
  var desc = document.getElementById('desc_textbox').value
  var tagsString = document.getElementById('tags_textbox').value
  var bounty = Number(document.getElementById('bounty_textbox').value)
  var tags = tagsString.split(',');
  for (var i = 0; i < tags.length; i++) {
    tags[i] = tags[i].trim();
  }

  addRequest(name, desc, tags, bounty, "TESTUSER"); //replace "TESTUSER" with the name of the user account
  console.log("Name of request: " + name);
  console.log("Description: " + desc);
  console.log("Tags: " + tags);
  console.log("Bounty: " + bounty);
}

const testinput = ReactDOM.createRoot(document.getElementById('test'));

function testform()
{
  const handleSubmit = event => {
    event.preventDefault();
    requestButtonOnClick();
  }
  return(
    <div className="wrapper">
      <h1>How About Them Apples</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <div>
            <p>Name of Request:</p>
            <input type="text" id="name_textbox"/>
          </div>
          <div>
            <p>Description:</p>
            <input type="text" id="desc_textbox"/>
          </div>
          <div>
            <p>Tags (separated by commas):</p>
            <input type="text" id="tags_textbox"/>
          </div>
          <div>
            <p>Bounty (numbers only)</p>
            <input type="number" id="bounty_textbox"/>
          </div>
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}
testinput.render(testform());
