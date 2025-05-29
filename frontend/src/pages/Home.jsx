import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { slides } from "../Data/Slides";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Play } from "lucide-react";

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
    <div className="pt-20 w-full min-h-screen flex flex-col items-center text-white bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <motion.div
          key={slides[currentSlide].id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`relative rounded-2xl shadow-2xl bg-gradient-to-r ${slides[currentSlide].color} backdrop-blur-md bg-opacity-80 p-8 sm:p-12 lg:p-16 border border-white/20`}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 drop-shadow-md tracking-tight">
            {slides[currentSlide].title}
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl opacity-90 drop-shadow-sm max-w-2xl mx-auto">
            {slides[currentSlide].subtitle}
          </p>
          <Link
            to="/chat"
            className="mt-8 inline-flex items-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-full shadow-md hover:bg-gray-200 transition-colors"
          >
            Try WeConnect Now <ChevronRight className="ml-2 w-5 h-5" />
          </Link>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-10">
          Why Choose WeConnect WeBot?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Real-Time Chat",
              desc: "Engage in seamless, instant conversations with our AI-powered WeBot.",
              icon: "💬",
            },
            {
              title: "Voice Interaction",
              desc: "Use voice commands for a hands-free experience with advanced speech recognition.",
              icon: "🎙️",
            },
            {
              title: "Personalized Responses",
              desc: "Get tailored answers based on your conversation history and preferences.",
              icon: "🧠",
            },
            {
              title: "Secure Authentication",
              desc: "Safe and easy login with Firebase Authentication for a protected experience.",
              icon: "🔒",
            },
            {
              title: "Video Call Support",
              desc: "Connect face-to-face with our upcoming video call feature for enhanced interaction.",
              icon: "📹",
            },
            {
              title: "Cross-Platform",
              desc: "Access WeBot on any device, anywhere, with a responsive design.",
              icon: "📱",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-all"
            >
              <span className="text-4xl mb-4 block">{feature.icon}</span>
              <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Action Cards Grid */}
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-10">
          Get Started Today
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/chat"
            className="group bg-gradient-to-r from-rose-500 to-orange-400 rounded-xl shadow-md p-6 hover:shadow-xl hover:scale-105 transform transition-all duration-300"
          >
            <h3 className="text-xl font-semibold text-gray-900">Chat Now</h3>
            <p className="text-sm text-gray-700 mt-1">Join conversations in real-time</p>
            <ChevronRight className="mt-3 text-gray-700 group-hover:text-white transition-colors w-6 h-6" />
          </Link>

          {!user ? (
            <>
              <Link
                to="/login"
                className="group bg-gradient-to-r from-blue-500 to-indigo-400 rounded-xl shadow-md p-6 hover:shadow-xl hover:scale-105 transform transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-gray-900">Login</h3>
                <p className="text-sm text-gray-700 mt-1">Access your existing account</p>
                <ChevronRight className="mt-3 text-gray-700 group-hover:text-white transition-colors w-6 h-6" />
              </Link>
              <Link
                to="/signup"
                className="group bg-gradient-to-r from-teal-500 to-green-400 rounded-xl shadow-md p-6 hover:shadow-xl hover:scale-105 transform transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-gray-900">Sign Up</h3>
                <p className="text-sm text-gray-700 mt-1">Create a new account and join</p>
                <ChevronRight className="mt-3 text-gray-700 group-hover:text-white transition-colors w-6 h-6" />
              </Link>
            </>
          ) : (
            <div className="bg-gradient-to-r from-cyan-500 to-blue-400 rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900">Welcome</h3>
              <p className="text-sm text-gray-700 mt-1 text-center break-words">
                Logged in as: <strong>{user.email}</strong>
              </p>
            </div>
          )}

          <Link
            to="/video"
            className="group bg-gradient-to-r from-yellow-500 to-pink-400 rounded-xl shadow-md p-6 hover:shadow-xl hover:scale-105 transform transition-all duration-300"
          >
            <h3 className="text-xl font-semibold text-gray-900">Start Video Call</h3>
            <p className="text-sm text-gray-700 mt-1">Connect with video for real-time support</p>
            <ChevronRight className="mt-3 text-gray-700 group-hover:text-white transition-colors w-6 h-6" />
          </Link>
        </div>
      </div>

      {/* Video Showcase Section */}
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-12 bg-gray-900 text-white">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10">
          See WeBot in Action
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "WeBot Chat Demo",
              url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              desc: "Watch how WeBot handles real-time conversations with ease.",
            },
            {
              title: "Voice Interaction Tutorial",
              url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              desc: "Learn how to use voice commands with WeBot’s speech recognition.",
            },
          ].map((video, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                <iframe
                  src={video.url}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <h3 className="text-xl font-semibold mt-4">{video.title}</h3>
              <p className="text-sm text-gray-300 mt-2">{video.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
          Ready to Connect?
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Join thousands of users experiencing seamless AI conversations with WeConnect WeBot. Start now and explore the future of interaction.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/chat"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-md hover:bg-indigo-700 transition-colors"
          >
            Start Chatting <ChevronRight className="ml-2 w-5 h-5" />
          </Link>
          <Link
            to="#"
            className="inline-flex items-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-full shadow-md border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            Learn More <Play className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Footer Links */}
      <div className="w-full bg-gray-900 text-gray-300 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">About</h4>
              <ul className="space-y-2">
                <li><Link to="/#" className="hover:text-white transition-colors">Our Story</Link></li>
                <li><Link to="/#" className="hover:text-white transition-colors">Team</Link></li>
                <li><Link to="/#" className="hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><a href="mailto:praweengupta11001@gmail.com" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><Link to="#" className="hover:text-white transition-colors">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Community</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><a href="https://drive.google.com/file/d/1Evzo2cpVyEuyikSokgjIl6cneOM_t9rd/view?usp=drive_link" target="_blank" className="hover:text-indigo-500 transition-colors">Developer</a></li>
                <li><a href="http://www.linkedin.com/in/praveen-gupta-b783791b4" target="_blank" className="hover:text-indigo-500 transition-colors">LinkedIn</a></li>
                <li><a href="https://github.com/PraveenGupta11001?tab=repositories" target="_blank" className="hover:text-indigo-500 transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center text-sm">
            <p>&copy; 2025 WeConnect. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}