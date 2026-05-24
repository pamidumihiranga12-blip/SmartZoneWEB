import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// ඔබේ Firebase Config දත්ත (රූපයේ තිබූ පරිදි)
const firebaseConfig = {
  apiKey: "AIzaSyBglGLuQFog9uJ1BF-4aKR0WEIZHPS046M",
  authDomain: "myweb-7ecb4.firebaseapp.com",
  projectId: "myweb-7ecb4",
  storageBucket: "myweb-7ecb4.firebasestorage.app",
  messagingSenderId: "1027238820127",
  appId: "1:1027238820127:web:7b3d49b74d8161ec53582a",
  measurementId: "G-81JY5FKV0E"
};

// Firebase Initialize කිරීම
const app = initializeApp(firebaseConfig);

// අපිට අවශ්‍ය සේවාවන් Export කිරීම
export const db = getFirestore(app);
export const auth = getAuth(app);