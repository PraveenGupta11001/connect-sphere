import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCg2mVYnwnGnMfN9h6av4g5GyvOS1z1nuE",
  authDomain: "test-fb-7e4a7.firebaseapp.com",
  projectId: "test-fb-7e4a7",
  storageBucket: "test-fb-7e4a7.appspot.com",
  messagingSenderId: "346738489550",
  appId: "1:346738489550:web:1719b254f27005c589789f"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
