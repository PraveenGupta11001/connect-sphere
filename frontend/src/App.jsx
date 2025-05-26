// src/App.jsx
import './App.css';
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./features/auth/firebaseAuth";
import { setUser, clearUser } from "./features/auth/authSlice";

import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import loading from './assets/loading.gif';

export default function App() {
  const dispatch = useDispatch();
  // Add a loading state to wait for Firebase auth initialization
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }));
      } else {
        dispatch(clearUser());
      }
      setAuthInitialized(true);  // Mark auth is done initializing on first event
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (!authInitialized) {
    // Optionally show a spinner or loading indicator while auth initializes
    return (
      <div className="flex items-center justify-center min-h-screen">
        <img src={loading} alt="loading..." className='opacity-90'/>
      </div>
    );
  }

  return (
    <div className='w-full'>
      <div className='lg:w-[85%] lg:m-auto overflow-x-hidden'>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Navbar />
          <AppRoutes />
          <Footer />
          <ToastContainer autoClose={3000} hideProgressBar />
        </BrowserRouter>
      </div>
    </div>
  );
}
