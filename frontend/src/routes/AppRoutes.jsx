import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Chat from "../pages/Chat";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ChatRoom from "../pages/ChatRoom";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/chat/chatrm" element={<ChatRoom />} />

    </Routes>
  );
}
