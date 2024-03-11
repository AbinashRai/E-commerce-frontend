// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyACBKT4SXJYnAx4sofeC7VyhHtbBN1oTqw",
  authDomain: "mern-ecommerce-d5334.firebaseapp.com",
  projectId: "mern-ecommerce-d5334",
  storageBucket: "mern-ecommerce-d5334.appspot.com",
  messagingSenderId: "646537827828",
  appId: "1:646537827828:web:5ed45571a29656c3a695a1",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
