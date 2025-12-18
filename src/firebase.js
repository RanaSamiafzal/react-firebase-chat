// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBouCaxmAqZm29MZhdC1iabl-CZFuRXPy4",
  authDomain: "pchat-d68b5.firebaseapp.com",
  projectId: "pchat-d68b5",
  storageBucket: "pchat-d68b5.firebasestorage.app",
  messagingSenderId: "822909117903",
  appId: "1:822909117903:web:5a8b0988286c85fbbedeba"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider();
export const db=getFirestore(app)