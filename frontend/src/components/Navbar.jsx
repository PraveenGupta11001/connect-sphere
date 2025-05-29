import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/auth/firebaseAuth";
import { clearUser } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import userIconImg from "../assets/user-286.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [showOpt, setShowOpt] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to logout");
    }
  };

  const handleWeBotClick = () => {
    setIsOpen(false);
    const weBotButton = document.querySelector("#we-bot-button");
    if (weBotButton) {
      weBotButton.click();
    } else {
      console.warn("WeBot button not found. Ensure WeBot component is rendered.");
    }
  };

  useEffect(() => {
    setIsOpen(false);
    setShowOpt(false);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest("#user-icon-button") && !event.target.closest("#menu-dropdown")) {
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
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-40">
      <div className="max-w-8xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-indigo-600 tracking-wide">
          WeConnect
        </Link>

        {/* Desktop nav (for tablet/laptop) */}
        <nav className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="text-gray-700 hover:text-indigo-600 transition">
            Home
          </Link>
          <Link to="/chat" className="text-gray-700 hover:text-indigo-600 transition">
            Chat
          </Link>
          <a href="https://drive.google.com/file/d/1Evzo2cpVyEuyikSokgjIl6cneOM_t9rd/view?usp=drive_link" target="_blank" className="text-gray-700 hover:text-indigo-600 transition">
            Devs Profile
          </a>
          

          {!user ? (
            <>
              <Link to="/login" className="text-gray-700 hover:text-indigo-600 transition">
                Login
              </Link>
              <Link to="/signup" className="text-gray-700 hover:text-indigo-600 transition">
                Sign Up
              </Link>
            </>
          ) : null}

          {/* User icon at the end */}
          <div className="relative">
            <button
              id="user-icon-button"
              onClick={() => setShowOpt(!showOpt)}
              className="focus:outline-none"
              aria-label="User menu"
              aria-expanded={showOpt}
            >
              <img
                src={user?.photoURL || userIconImg}
                alt="User"
                className="w-8 h-8 rounded-full object-cover"
              />
            </button>

            {showOpt && user && (
              <div
                id="menu-dropdown"
                className="absolute right-0 top-12 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50"
              >
                <div className="text-gray-700 font-semibold px-3 py-2 border-b border-gray-200">
                  {getDisplayName()}
                </div>
                <button
                  onClick={() => {
                    navigate("/profile");
                    setShowOpt(false);
                  }}
                  className="block w-full text-left text-black border border-gray-200 rounded-xl py-2 px-3 mt-2 mb-2 hover:bg-indigo-200"
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
        </nav>

        {/* Mobile view (smaller screens) */}
        <div className="md:hidden flex items-center space-x-3">
        <a href="https://drive.google.com/file/d/1Evzo2cpVyEuyikSokgjIl6cneOM_t9rd/view?usp=drive_link" target="_blank" className="text-gray-700 hover:text-indigo-600 transition">
            Devs
          </a>
          {user ? (
            <button
              onClick={() => navigate("/profile")}
              className="focus:outline-none"
              aria-label="Go to profile"
            >
              <img
                src={user.photoURL || userIconImg}
                alt="User"
                className="w-8 h-8 rounded-full object-cover"
              />
            </button>
          ) : null}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <nav className="md:hidden px-4 pb-4 space-y-3 flex flex-col bg-white shadow">
          {user && (
            <div className="text-gray-700 font-semibold py-2 border-b border-gray-200">
              {getDisplayName()}
            </div>
          )}
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="text-gray-700 hover:text-indigo-600"
          >
            Home
          </Link>
          <Link
            to="/chat"
            onClick={() => setIsOpen(false)}
            className="text-gray-700 hover:text-indigo-600"
          >
            Chat
          </Link>
          <button
            onClick={handleWeBotClick}
            className="text-gray-700 hover:text-indigo-600 text-left"
          >
            WeBot
          </button>

          {!user ? (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-indigo-600"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-indigo-600"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="text-red-600 hover:underline text-left"
            >
              Logout
            </button>
          )}
        </nav>
      )}
    </header>
  );
}