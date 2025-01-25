import { initializeApp } from "@firebase/app";
import { connectFirestoreEmulator, getFirestore } from "@firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDXlE4jNzAxnNuOzQz0gVk6wPFgJ0xph8k",
  authDomain: "helpdad.firebaseapp.com",
  projectId: "helpdad",
  storageBucket: "helpdad.appspot.com",
  messagingSenderId: "150569758046",
  appId: "1:150569758046:web:86d62db4bc2a80044073cf",
  measurementId: "G-P61R0TBTZS"
};
// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp)


// Connect to Firestore emulator if running locally
if (typeof window !== 'undefined' && window.location.hostname === "localhost") {
  connectFirestoreEmulator(db, "localhost", 8080);
}

export { db };

