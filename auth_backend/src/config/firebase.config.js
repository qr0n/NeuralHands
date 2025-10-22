// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCFIAHqiknYIeJd_Y-mKRA23jSwSzM9Cx0",
  authDomain: "neural-hand.firebaseapp.com",
  projectId: "neural-hand",
  storageBucket: "neural-hand.firebasestorage.app",
  messagingSenderId: "667946563333",
  appId: "1:667946563333:web:26e66e56246b369fb3e96c",
  measurementId: "G-QCS5RV45LT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);