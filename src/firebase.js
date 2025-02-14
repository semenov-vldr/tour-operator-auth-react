import { initializeApp } from "firebase/app";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth} from "firebase/auth";
import { getDatabase } from 'firebase/database';


const firebaseConfig = {
  apiKey: "AIzaSyDTOKorK0gYHEagyK82T26859BAauu3tjI",
  authDomain: "fir-auth-1daae.firebaseapp.com",
  databaseURL: "https://fir-auth-1daae-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fir-auth-1daae",
  storageBucket: "fir-auth-1daae.firebasestorage.app",
  messagingSenderId: "425328990391",
  appId: "1:425328990391:web:69aa020ba978a071871532"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);


export const createUser = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
}

export const signInUser = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
}