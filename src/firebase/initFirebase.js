
import { initializeApp } from "firebase/app";
import {collection, getDocs, getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";

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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

export async function getUser() {
    let user = null;

    const users = await getDocs(collection(db, "Users"));
    const authUID = auth.currentUser.uid;
    await users.forEach((userIter) => {
        if (userIter.data().UID === authUID) {
            user = userIter.data();
        }
    });
    console.log("1USER: " + user.UID);
    return user
}

export { app, db, auth };