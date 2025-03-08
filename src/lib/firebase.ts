// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDK9s_8Zejb9mjkFAQXCSuL6FchKQnaOnY",
  authDomain: "aegis-e265d.firebaseapp.com",
  projectId: "aegis-e265d",
  storageBucket: "aegis-e265d.appspot.com",
  messagingSenderId: "167192758124",
  appId: "1:167192758124:web:e6b6e1c83fc34d73d89549",
  measurementId: "G-7C3FQ9GS70"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firestore instance
const db = getFirestore(app);
const storage = getStorage(app);

export { db , storage};
