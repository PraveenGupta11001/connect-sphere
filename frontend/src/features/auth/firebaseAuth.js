// src/features/auth/firebaseAuth.js
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../../firebase/config";

export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signupWithEmail = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export const loginWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const logoutUser = () => signOut(auth);

export const loginWithGoogle = () => signInWithPopup(auth, provider);
