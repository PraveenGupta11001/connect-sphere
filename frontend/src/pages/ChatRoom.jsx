import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, CircleChevronLeft, Search, SendHorizontal } from "lucide-react";
import userIcon from '../assets/user-286.png'
import { sendMessage, fetchMessages } from "../features/chat/chatService";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { Link } from "react-router-dom";

export default function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messageContainerRef = useRef(null);
  const [receiverInfo, setReceiverInfo] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const { chatUserId } = useParams();

  // Fetch receiver user info based on chatUserId param
  useEffect(() => {
    if (!chatUserId) return;

    const fetchReceiver = async () => {
      try {
        const docSnap = await getDoc(doc(db, "users", chatUserId));
        if (docSnap.exists()) {
          setReceiverInfo(docSnap.data());
        } else {
          setReceiverInfo(null);
        }
      } catch (error) {
        console.error("Error fetching receiver info:", error);
      }
    };

    fetchReceiver();
  }, [chatUserId]);

  // Listen for real-time messages filtered between logged-in user and receiver
  useEffect(() => {
    if (!user?.email || !receiverInfo?.email) {
      setMessages([]);
      return;
    }

    const unsubscribe = fetchMessages((msgs) => {
      // Filter messages between these two users only
      const filtered = msgs.filter(
        (m) =>
          (m.sender === user.email && m.receiver === receiverInfo.email) ||
          (m.receiver === user.email && m.sender === receiverInfo.email)
      );
      setMessages(filtered);
    });

    return () => unsubscribe();
  }, [user, receiverInfo]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const container = messageContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  // Send message handler
  const handleSend = async () => {
    if (!input.trim() || !user?.email || !receiverInfo?.email) return;

    try {
      await sendMessage(user.email, receiverInfo.email, input.trim());
      setInput("");
    } catch (error) {
      console.error("Send message failed:", error);
    }
  };

  // Send message on Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  if (!user) return <div>Loading...</div>;
  if (!receiverInfo) return <div className="p-4">Select a user to chat with.</div>;

  return (
    <div className="pt-15 h-screen grid grid-cols-1 md:grid-cols-3 overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col p-4 border-r md:col-span-1 bg-white">
        <div className="relative mb-4">
          <input
            type="search"
            placeholder="Search chats..."
            className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
          />
          <Search size={20} className="absolute right-3 top-2.5 text-gray-500" />
        </div>

        {/* Receiver info box (static for now) */}
        <div className="flex items-center gap-2 py-2 px-2 hover:bg-gray-200 rounded-lg cursor-pointer">
          <img
            src={receiverInfo.photoURL || userIcon}
            alt="User"
            className="h-10 w-10 rounded-full"
          />
          <span>{receiverInfo.displayName || "Loading..."}</span>
        </div>
      </div>

      {/* Chat Panel */}
      <div className="flex flex-col md:col-span-2 bg-gray-100 h-screen">
        {/* Header */}
        <div className="flex items-center gap-2 border-b p-4 bg-white shadow-md">
        <Link to="/chat/"><ArrowLeft size={25} className="text-gray-500" /></Link>
          <img
            src={receiverInfo.photoURL || userIcon}
            alt="User"
            className="h-12 w-12 rounded-full"
          />
          <h3 className="text-lg font-semibold">{receiverInfo.displayName || "Loading..."}</h3>
        </div>

        {/* Messages container */}
        <div
          className="flex-1 overflow-y-auto px-4 py-2 mb-17 space-y-2"
          ref={messageContainerRef}
          style={{ maxHeight: "calc(100vh - 220px)" }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-lg max-w-xs break-words whitespace-pre-wrap overflow-hidden ${
                msg.sender === user.email
                  ? "bg-indigo-500 text-white self-end ml-auto"
                  : "bg-white text-black self-start"
              }`}
            >
              <p>{msg.text}</p>
              <span className="text-xs block mt-1 opacity-60">
                {msg.timestamp?.toDate?.().toLocaleTimeString() || "..."}
              </span>
            </div>
          ))}
        </div>

        {/* Input box */}
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t p-4 flex items-center gap-2">
          <input
            type="text"
            placeholder="Write a message..."
            className="flex-grow border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="rounded-full bg-indigo-500 p-2 hover:bg-indigo-600 disabled:opacity-50"
            aria-label="Send message"
          >
            <SendHorizontal size={22} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
}
