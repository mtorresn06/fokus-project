// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCIkTChI29TuVo66qLkTQtsWi1P3iSr4OQ",
  authDomain: "fokushosting.firebaseapp.com",
  projectId: "fokushosting",
  storageBucket: "fokushosting.firebasestorage.app",
  messagingSenderId: "249929502390",
  appId: "1:249929502390:web:fff69eebe51a57398a2017",
  measurementId: "G-CLWV1C8YQN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { auth, analytics, db };