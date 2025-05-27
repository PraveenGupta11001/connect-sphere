import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import userIcon from '../assets/user-286.png';
import { ArrowLeft } from 'lucide-react';
import { fetchMessages } from "../features/chat/chatService";
import dayjs from "dayjs";

export default function Chat() {
  const user = useSelector((state) => state.auth.user);
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const userList = snapshot.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        }));
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Fetch messages and build conversations for all users
  useEffect(() => {
    if (!user?.email || users.length === 0) return;

    const unsubscribe = fetchMessages((msgs) => {
      // Create a conversation entry for each user
      const conversationList = users.map((otherUser) => {
        // Find messages between the current user and this user
        const messagesBetween = msgs.filter(
          (m) =>
            (m.sender === user.email && m.receiver === otherUser.email) ||
            (m.receiver === user.email && m.sender === otherUser.email)
        );

        // If there are messages, get the most recent one
        let lastMessage = null;
        let timestamp = null;
        let sender = null;
        if (messagesBetween.length > 0) {
          const mostRecentMessage = messagesBetween.sort(
            (a, b) => (b.timestamp?.toDate()?.getTime() || 0) - (a.timestamp?.toDate()?.getTime() || 0)
          )[0];
          lastMessage = mostRecentMessage.text;
          timestamp = mostRecentMessage.timestamp;
          sender = mostRecentMessage.sender === user.email ? "You" : otherUser.displayName || "Unnamed User";
        }

        return {
          uid: otherUser.uid,
          displayName: otherUser.displayName,
          email: otherUser.email,
          photoURL: otherUser.photoURL,
          lastMessage: lastMessage || "No messages yet",
          timestamp: timestamp,
          sender: sender || "",
        };
      });

      // Sort conversations by timestamp (most recent first, null timestamps last)
      const sortedConversations = conversationList.sort((a, b) => {
        const timeA = a.timestamp?.toDate()?.getTime() || 0;
        const timeB = b.timestamp?.toDate()?.getTime() || 0;
        return timeB - timeA;
      });

      setConversations(sortedConversations);
    });

    return () => unsubscribe();
  }, [user, users]);

  // Redirect to self-chat or first chat on larger devices
  useEffect(() => {
    if (!user || conversations.length === 0) return;

    const isMobile = window.innerWidth < 768; // Tailwind's 'md' breakpoint
    if (!isMobile) {
      // On larger devices, redirect to self-chat or first chat
      const chatUser = conversations.find((conv) => conv.uid === user.uid) || conversations[0];
      if (chatUser) {
        navigate(`/chat/${chatUser.uid}`);
      }
    }
  }, [user, conversations, navigate]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100 px-4 py-8">
        <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full text-center transform transition-all duration-300 hover:scale-105">
          <h2 className="text-3xl font-bold text-indigo-600 mb-4">Welcome to ChatApp</h2>
          <p className="text-gray-600 text-lg mb-8">
            Join the conversation! Log in or sign up to start chatting with friends.
          </p>
          <div className="flex flex-col space-y-4">
            <Link to="/login">
              <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105">
                Log In
              </button>
            </Link>
            <Link to="/signup">
              <button className="w-full bg-white text-indigo-600 border border-indigo-600 py-3 rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filter conversations based on search term
  const filteredConversations = conversations.filter((conv) =>
    (conv.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     conv.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex-1 bg-white">
      <div className="fixed top-16 left-0 right-0 z-10 bg-white shadow-lg p-4">
        <div className="flex items-center gap-4 max-w-4xl mx-auto px-4">
          <Link to="/" className="flex items-center">
            <ArrowLeft size={24} className="text-gray-600 hover:text-indigo-600 transition-colors" />
          </Link>
          <div className="flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full rounded-lg px-4 py-2.5 bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="pt-24 mt-15 overflow-y-auto pb-8 px-4 sm:px-6 lg:px-8 max-w-4xl" style={{ maxHeight: "75vh", overflowY: "auto" }}>
        {filteredConversations.length === 0 ? (
          <p className="text-gray-500 text-center text-sm font-medium py-8">No users found.</p>
        ) : (
          filteredConversations.map((conv) => (
            <Link key={conv.uid} to={`/chat/${conv.uid}`}>
              <div className="flex items-center gap-3 hover:bg-gray-100 rounded-xl p-3 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer w-full">
                <img
                  src={conv.photoURL || userIcon}
                  alt="avatar"
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900 text-base truncate">
                      {conv.uid === user.uid ? "You (Self)" : (conv.displayName || "Unnamed User")}
                    </h3>
                    <span className="text-gray-500 text-xs">
                      {conv.timestamp ? dayjs(conv.timestamp.toDate()).format("HH:mm") : ""}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm truncate">
                    {conv.sender ? `${conv.sender}: ${conv.lastMessage}` : conv.lastMessage}
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}