import { initializeApp } from "@firebase/app";
import { connectFirestoreEmulator, getFirestore } from "@firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBGqZ7eegcJmZ10cel2Z0kcE-gGuJytiBo",
  authDomain: "helpdad-96fe3.firebaseapp.com",
  projectId: "helpdad-96fe3",
  storageBucket: "helpdad-96fe3.firebasestorage.app",
  messagingSenderId: "895420914515",
  appId: "1:895420914515:web:480de1c3527f21e82b9fa6",
  measurementId: "G-PZ8PEDBE2J"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp)


// Connect to Firestore emulator if running locally
if (typeof window !== 'undefined' && window.location.hostname === "localhost") {
  connectFirestoreEmulator(db, "localhost", 8080);
}

export { db };

