import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDocs, getFirestore } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
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
  
  
  

function addRequest(name, desc, tagsArray) {
    //name, description = strings, tags = string[]
    setDoc(doc(db, "Requests", name), {
      title: name,
      description: desc,
      tags: tagsArray
    });
  }

function onClick() {
    var name = document.getElementById('name_textbox').value
    var desc = document.getElementById('desc_textbox').value
    var tagsString = document.getElementById('tags_textbox').value
    var tags = tagsString.split(' ');
    addRequest(name, desc, tags);
    console.log(name);
    console.log(desc);
    console.log(tags);
  }

function testform()
{
  const handleSubmit = event => {
    event.preventDefault();
    onClick();
  }
  return(
    <div className="wrapper">
      <h1>How About Them Apples</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <div>
            <input type="text" id="name_textbox"/>
          </div>
          <div>
            <input type="text" id="desc_textbox"/>
          </div>
          <div>
            <input type="text" id="tags_textbox"/>
          </div>
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

function Requests()
{
    return (
        testform()
    );
}

export default Requests