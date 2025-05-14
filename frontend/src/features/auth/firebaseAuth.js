// src/features/auth/firebaseAuth.js
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
  } from "firebase/auth";
  import { app } from "../../firebase/config";
  
  export const auth = getAuth(app);
  
  // Google provider
  const googleProvider = new GoogleAuthProvider();
  export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
  
  // GitHub provider
  const githubProvider = new GithubAuthProvider();
  export const loginWithGithub = () => signInWithPopup(auth, githubProvider);
  
  // Email/Password methods
  export const signupWithEmail = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);
  
  export const loginWithEmail = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);
  
  export const logoutUser = () => signOut(auth);
  