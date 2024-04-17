// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // getAuth
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAeM-xQ3XBCA35DZENTjOhMN8mRkMQiShk",
    authDomain: "moneymind-b878b.firebaseapp.com",
    projectId: "moneymind-b878b",
    storageBucket: "moneymind-b878b.appspot.com",
    messagingSenderId: "1020992987957",
    appId: "1:1020992987957:web:f7e57e990e4392849c227c",
    measurementId: "G-5HWM3LY11X"
  };

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const auth = getAuth();

export { app, auth, db };
