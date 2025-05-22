import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { slides } from "../Data/Slides";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

import Test from "./Test";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pt-20 w-full min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-12 text-center">
        {/* Slide Carousel */}
        <motion.div
          key={slides[currentSlide].id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`relative rounded-2xl shadow-xl bg-gradient-to-r ${slides[currentSlide].color} backdrop-blur-md bg-opacity-80 p-8 sm:p-12 lg:p-16 border border-white/20`}
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-md">
            {slides[currentSlide].title}
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl opacity-90 drop-shadow-sm">
            {slides[currentSlide].subtitle}
          </p>
        </motion.div>
  
        {/* Action Cards Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
          <Link
            to="/chat"
            className="group bg-gradient-to-r from-rose-500 to-orange-400 rounded-xl shadow-md p-6 hover:shadow-lg hover:scale-105 transform transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-900">Chat Now</h2>
            <p className="text-sm text-gray-700 mt-1   mt-1">Join conversations in real-time</p>
            <ChevronRight className="mt-3 text-gray-700 group-hover:text-indigo-600 transition-colors w-6 h-6" />
          </Link>
  
          {!user ? (
            <>
              <Link
                to="/login"
                className="group bg-gradient-to-r from-blue-500 to-indigo-400 rounded-xl shadow-md p-6 hover:shadow-lg hover:scale-105 transform transition-all duration-300"
              >
                <h2 className="text-xl font-semibold text-gray-900">Login</h2>
                <p className="text-sm text-gray-700 mt-1">Access your existing account</p>
                <ChevronRight className="mt-3 text-gray-700 group-hover:text-indigo-600 transition-colors w-6 h-6" />
              </Link>
  
              <Link
                to="/signup"
                className="group bg-gradient-to-r from-teal-500 to-green-400 rounded-xl shadow-md p-6 hover:shadow-lg hover:scale-105 transform transition-all duration-300"
              >
                <h2 className="text-xl font-semibold text-gray-900">Sign Up</h2>
                <p className="text-sm text-gray-700 mt-1">Create a new account and join</p>
                <ChevronRight className="mt-3 text-gray-700 group-hover:text-indigo-600 transition-colors w-6 h-6" />
              </Link>
            </>
          ) : (
            <div className="bg-gradient-to-r from-cyan-500 to-blue-400 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900">Welcome</h2>
              <p className="text-sm text-gray-700 mt-1 text-center break-words">
                Logged in as: <strong>{user.email}</strong>
              </p>
            </div>
          )}

          {/* <Test className="bg-black" /> */}
  
          <Link
            to="/"
            className="group bg-gradient-to-r from-yellow-500 to-pink-400 rounded-xl shadow-md p-6 hover:shadow-lg hover:scale-105 transform transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-900">Start Video Call</h2>
            <p className="text-sm text-gray-700 mt-1">Get help and explore common questions</p>
            <ChevronRight className="mt-3 text-gray-700 group-hover:text-indigo-600 transition-colors w-6 h-6" />
          </Link>
        </div>
      </div>
      
    </div>
  );
}