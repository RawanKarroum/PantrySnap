// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { browserLocalPersistence, GoogleAuthProvider, onAuthStateChanged, setPersistence, signInWithPopup } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "pantry-snap.firebaseapp.com",
  projectId: "pantry-snap",
  storageBucket: "pantry-snap.appspot.com",
  messagingSenderId: "604577139135",
  appId: "1:604577139135:web:86b02a6c25aaf7c57cf90a",
  measurementId: "G-ZMEH4KSLPX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app)

setPersistence(auth, browserLocalPersistence); // Ensure persistence is set

const signInWithGoogle = () => {
  return signInWithPopup(auth, provider);
};

export { db, auth, storage, app, firebaseConfig, signInWithGoogle};