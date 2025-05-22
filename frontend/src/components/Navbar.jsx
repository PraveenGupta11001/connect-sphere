// src/components/Navbar.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/auth/firebaseAuth";
import { clearUser } from "../features/auth/authSlice";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  console.log(user)
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await logoutUser();
    dispatch(clearUser());
  };

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 w-screen">
      <div className="max-w-8xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-indigo-600 tracking-wide">
          ConnectSphere
        </Link>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-700 hover:text-indigo-600 transition">Home</Link>
          <Link to="/chat" className="text-gray-700 hover:text-indigo-600 transition">Chat</Link>
          {!user ? (
            <>
              <Link to="/login" className="text-gray-700 hover:text-indigo-600">Login</Link>
              <Link to="/signup" className="text-gray-700 hover:text-indigo-600">Sign Up</Link>
            </>
          ) : (
            <div className="flex space-x-5">
              <button className="text-gray-700 hover:text-indigo-600 transition">{user.email}</button>
              <button onClick={handleLogout} className="text-red-600 hover:underline">Logout</button>
            </div>
          )}
          
        </nav>
      </div>

      {isOpen && (
        <nav className="md:hidden px-4 pb-4 space-y-3 flex flex-col bg-white shadow">
          <Link to="/" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-indigo-600">Home</Link>
          <Link to="/chat" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-indigo-600">Chat</Link>
          {!user ? (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-indigo-600">Login</Link>
              <Link to="/signup" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-indigo-600">Sign Up</Link>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Link to="#" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-indigo-600">{user.email}</Link>
              <div>
                <ul>
                  <li>
                    <button onClick={() => {setIsOpen(false); handleLogout();}} className="text-red-600 hover:underline"> Logout </button>

                  </li>
                </ul>
              </div>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
