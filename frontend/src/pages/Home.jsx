import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { slides } from "../Data/Slides";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

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
    <div className="w-full min-h-screen flex flex-col items-center justify-center text-white bg-white">
      <div className="w-full max-w-6xl p-4 text-center">
        {/* Slide Carousel */}
        <motion.div
          key={slides[currentSlide].id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`rounded-2xl shadow-xl bg-gradient-to-r ${slides[currentSlide].color} p-6 md:p-10 lg:p-14`}
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {slides[currentSlide].title}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl opacity-90">
            {slides[currentSlide].subtitle}
          </p>
        </motion.div>
  
        {/* Action Cards Grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
          <Link
            to="/chat"
            className="bg-gradient-to-r from-rose-400 to-orange-300 rounded-2xl shadow-md p-6 hover:scale-105 transform transition duration-300"
          >
            <h2 className="text-xl font-semibold">Chat Now</h2>
            <p className="text-sm">Join conversations in real-time</p>
            <ChevronRight className="mt-2" />
          </Link>
  
          {!user ? (
            <>
              <Link
                to="/login"
                className="bg-gradient-to-r from-blue-400 to-purple-300 rounded-2xl shadow-md p-6 hover:scale-105 transform transition duration-300"
              >
                <h2 className="text-xl font-semibold">Login</h2>
                <p className="text-sm">Access your existing account</p>
                <ChevronRight className="mt-2" />
              </Link>
  
              <Link
                to="/signup"
                className="bg-gradient-to-r from-green-400 to-teal-300 rounded-2xl shadow-md p-6 hover:scale-105 transform transition duration-300"
              >
                <h2 className="text-xl font-semibold">Sign Up</h2>
                <p className="text-sm">Create a new account and join</p>
                <ChevronRight className="mt-2" />
              </Link>
            </>
          ) : (
            <div className="col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-1 flex flex-col items-center justify-center bg-gradient-to-r from-cyan-400 to-blue-300 rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-semibold">Welcome</h2>
              <p className="text-sm text-center break-words">
                Logged in as: <strong>{user.email}</strong>
              </p>
            </div>
          )}
  
          <Link
            to="/faq"
            className="bg-gradient-to-r from-yellow-400 to-pink-400 rounded-2xl shadow-md p-6 hover:scale-105 transform transition duration-300"
          >
            <h2 className="text-xl font-semibold">FAQs</h2>
            <p className="text-sm">Get help and explore common questions</p>
            <ChevronRight className="mt-2" />
          </Link>
        </div>
      </div>
    </div>
  );
  
}
