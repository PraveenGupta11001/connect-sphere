// src/components/Navbar.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/auth/firebaseAuth";
import { clearUser } from "../features/auth/authSlice";
import { toast } from "react-toastify";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [showOpt, setShowOpt] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Helper to get display name or email prefix
  const getDisplayName = () => {
    if (!user) return "";
    if (user.displayName && user.displayName.trim() !== "") {
      return user.displayName;
    } else if (user.email) {
      return user.email.split("@")[0];
    }
    return "";
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(clearUser());
      navigate("/login"); // Navigate to login after logout
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to logout");
    }
  };

  useEffect(() => {
    // Close user options dropdown when user changes
    setShowOpt(false);
  }, [user]);

  // Close dropdown when clicking outside (optional)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest("#user-options-button") && !event.target.closest("#user-options-dropdown")) {
        setShowOpt(false);
      }
    };
    if (showOpt) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOpt]);

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-8xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-indigo-600 tracking-wide">
          WeConnect
        </Link>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="text-gray-700 hover:text-indigo-600 transition">
            Home
          </Link>
          <Link to="/chat" className="text-gray-700 hover:text-indigo-600 transition">
            Chat
          </Link>

          {!user ? (
            <>
              <Link to="/login" className="text-gray-700 hover:text-indigo-600">
                Login
              </Link>
              <Link to="/signup" className="text-gray-700 hover:text-indigo-600">
                Sign Up
              </Link>
              
            </>
          ) : (
            <div className="relative">
              <button
                id="user-options-button"
                onClick={() => setShowOpt(!showOpt)}
                className="text-gray-700 hover:text-indigo-600 transition"
                aria-haspopup="true"
                aria-expanded={showOpt}
              >
                {getDisplayName()}
              </button>

              {showOpt && (
                <div
                  id="user-options-dropdown"
                  className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50"
                >
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setShowOpt(false);
                    }}
                    className="block w-full text-left text-black border border-gray-200 rounded-xl py-2 px-3 mb-2 hover:bg-indigo-200"
                  >
                    Profile
                  </button>
                    
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowOpt(false);
                    }}
                    className="block w-full text-left text-red-600 border border-gray-200 rounded-xl py-2 px-3 hover:bg-indigo-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <nav className="md:hidden px-4 pb-4 space-y-3 flex flex-col bg-white shadow">
          <Link to="/" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-indigo-600">
            Home
          </Link>
          <Link to="/chat" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-indigo-600">
            Chat
          </Link>

          {!user ? (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-indigo-600">
                Login
              </Link>
              <Link to="/signup" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-indigo-600">
                Sign Up
              </Link>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <span onClick={()=> {navigate('/profile'); setIsOpen(false);}} className="text-gray-700">{getDisplayName()}</span>
              <ul>
                <li>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="text-red-600 hover:underline"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
