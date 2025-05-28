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
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

export const auth = getAuth(app);

// Google provider
const googleProvider = new GoogleAuthProvider();
export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  const userRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    const existingData = userDoc.data();
    return {
      user: {
        uid: user.uid,
        email: user.email,
        displayName: existingData.displayName || user.displayName || user.email,
        photoURL: existingData.photoURL || user.photoURL || "",
      },
      isNewUser: false,
    };
  } else {
    const userData = {
      email: user.email,
      displayName: user.displayName || user.email,
      photoURL: user.photoURL || "",
      phone: "",
      address: "",
    };
    await setDoc(userRef, userData, { merge: true });
    return {
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email,
        photoURL: user.photoURL || "",
      },
      isNewUser: true,
    };
  }
};

// GitHub provider
const githubProvider = new GithubAuthProvider();
export const loginWithGithub = async () => {
  const result = await signInWithPopup(auth, githubProvider);
  const user = result.user;

  const userRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    const existingData = userDoc.data();
    return {
      user: {
        uid: user.uid,
        email: user.email,
        displayName: existingData.displayName || user.displayName || user.email,
        photoURL: existingData.photoURL || user.photoURL || "",
      },
      isNewUser: false,
    };
  } else {
    const userData = {
      email: user.email,
      displayName: user.displayName || user.email,
      photoURL: user.photoURL || "",
      phone: "",
      address: "",
    };
    await setDoc(userRef, userData, { merge: true });
    return {
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email,
        photoURL: user.photoURL || "",
      },
      isNewUser: true,
    };
  }
};

// Email/Password methods
export const signupWithEmail = async (email, password, displayName) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  const userRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    const existingData = userDoc.data();
    return {
      user: {
        uid: user.uid,
        email: user.email,
        displayName: existingData.displayName || displayName || user.email,
        photoURL: existingData.photoURL || "",
      },
      isNewUser: false,
    };
  } else {
    const userData = {
      email: user.email,
      displayName: displayName || user.email,
      photoURL: "",
      phone: "",
      address: "",
    };
    await setDoc(userRef, userData, { merge: true });
    return {
      user: {
        uid: user.uid,
        email: user.email,
        displayName: displayName || user.email,
        photoURL: "",
      },
      isNewUser: true,
    };
  }
};

export const loginWithEmail = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  const userRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    const existingData = userDoc.data();
    return {
      user: {
        uid: user.uid,
        email: user.email,
        displayName: existingData.displayName || user.email,
        photoURL: existingData.photoURL || "",
      },
    };
  }
  return { user };
};

export const logoutUser = () => signOut(auth);