// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import errPage from '../assets/404-status-code.png';
import Home from "../pages/Home";
import Chat from "../pages/Chat";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ChatRoom from "../pages/ChatRoom";
import Profile from "../pages/Profile";
import { useSelector } from "react-redux";

// PrivateRoute component guards protected routes
const PrivateRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  return user ? children : <Navigate to="/login" replace />;
};

// PublicRoute component prevents logged-in users from accessing login/signup
const PublicRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  return !user ? children : <Navigate to="/chat" replace />;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Public routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

      {/* Protected routes */}
      <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
      <Route path="/chat/:chatUserId" element={<PrivateRoute><ChatRoom /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

      {/* Catch-all 404 */}
      <Route path="*" element={
          <img src={errPage} alt="Error 404: Page Not Found" className="mx-auto max-w-full w-11/12 sm:w-4/5 md:w-3/5 lg:w-2/5 my-20"/>
      } />
    </Routes>
  );
}
