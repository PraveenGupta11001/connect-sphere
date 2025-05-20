// ChatRoom.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  MoreVertical,
  Search,
  SendHorizontal,
  Trash2,
  Copy,
  Forward,
  MoreVerticalIcon,
  Crosshair,
  CrossIcon,
  HardDriveIcon,
  X
} from "lucide-react";
import dayjs from "dayjs";
import userIcon from "../assets/user-286.png";
import { sendMessage, fetchMessages } from "../features/chat/chatService";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase/config";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  deleteDoc,
} from "firebase/firestore";
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

export default function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatSearch, setChatSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [receiverInfo, setReceiverInfo] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const messageContainerRef = useRef(null);

  const user = useSelector((state) => state.auth.user);
  const { chatUserId } = useParams();

  // Fetch users list
  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const userList = snapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    };
    fetchUsers();
  }, []);

  const filteredUsers = users
    .filter((u) => u.uid !== user?.uid)
    .filter((u) =>
      u.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Fetch receiver info
  useEffect(() => {
    const fetchReceiver = async () => {
      if (!chatUserId) return;
      const docSnap = await getDoc(doc(db, "users", chatUserId));
      if (docSnap.exists()) setReceiverInfo(docSnap.data());
    };
    fetchReceiver();
  }, [chatUserId]);

  // Fetch & filter messages
  useEffect(() => {
    if (!user?.email || !receiverInfo?.email) return;

    const unsubscribe = fetchMessages((msgs) => {
      const filtered = msgs.filter(
        (m) =>
          (m.sender === user.email && m.receiver === receiverInfo.email) ||
          (m.receiver === user.email && m.sender === receiverInfo.email)
      );
      setMessages(filtered);
    });

    return () => unsubscribe();
  }, [user, receiverInfo]);

  // Auto-scroll
  useEffect(() => {
    const container = messageContainerRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(user.email, receiverInfo.email, input.trim());
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const formatDate = (date) => {
    const today = dayjs();
    const msgDate = dayjs(date);
    if (msgDate.isSame(today, "day")) return "Today";
    if (msgDate.isSame(today.subtract(1, "day"), "day")) return "Yesterday";
    return msgDate.format("DD MMM YYYY");
  };

  const filteredMessages = chatSearch
    ? messages.filter((m) =>
        m.text.toLowerCase().includes(chatSearch.toLowerCase())
      )
    : messages;

  let lastDate = "";

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "messages", id));
  };

  const handleCopy = (text) => {
    // navigator.clipboard.writeText(text);
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      // console.log("Text copied manually:", text);
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
    }
  };

  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-4">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col p-4 border-r bg-white">
        <input
          type="text"
          placeholder="Search users..."
          className="mb-4 p-2 border rounded-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="space-y-2 overflow-y-auto">
          {filteredUsers.map((u) => (
            <Link
              key={u.uid}
              to={`/chat/${u.uid}`}
              className={`flex items-center gap-2 p-2 rounded-lg ${
                chatUserId === u.uid ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
            >
              <img
                src={u.photoURL || userIcon}
                alt=""
                className="h-10 w-10 rounded-full"
              />
              <span className="truncate">{u.displayName}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Chat Panel */}
      <div className="relative top-16 col-span-3 flex flex-col bg-gray-50">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white shadow">
          <div className="flex items-center gap-3">
            <Link to="/chat">
              <ArrowLeft size={24} className="text-gray-600" />
            </Link>
            <img
              src={receiverInfo?.photoURL || userIcon}
              alt="User"
              className="h-10 w-10 rounded-full"
            />
            <h2 className="text-lg font-semibold">
              {receiverInfo?.displayName || "User"}
            </h2>
          </div>

          {/* Three Dots Menu */}
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)}>
              <MoreVertical />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow rounded-lg text-sm z-10">
                <button
                  className="w-full px-4 py-2 hover:bg-gray-100 text-left"
                  onClick={() => {
                    setShowSearch(true);
                    setShowMenu(false);
                  }}
                >
                  🔍 Search in chat
                </button>
            
              </div>
            )}
          </div>
        </div>

        {/* Search bar (only when enabled) */}
        {showSearch && (
          <div className="px-4 py-2 bg-white border-b shadow-sm flex items-center gap-2">
            <input
              type="text"
              placeholder="Search message..."
              value={chatSearch}
              onChange={(e) => setChatSearch(e.target.value)}
              className="w-full p-2 border rounded-full"
            />
            <X size={32} className="font-semibold hover:text-indigo-500 transition" onClick={()=>{setShowSearch(false);setShowMenu(false);}} />
          </div>
        )}

        {/* Messages */}
        <div
          ref={messageContainerRef}
          className="flex-1 overflow-y-auto px-4 py-2 space-y-2"
          style={{ maxHeight: "65vh" }}
        >
          {filteredMessages.map((msg, index) => {
            const msgDate = msg.timestamp?.toDate();
            const showDate = formatDate(msgDate) !== lastDate;
            if (showDate) lastDate = formatDate(msgDate);

            return (
              <div key={msg.id}>
                {showDate && (
                  <div className="text-center text-gray-500 text-sm mb-2">
                    {lastDate}
                  </div>
                )}

                <div
                  className={`group relative p-3 rounded-lg max-w-[70%] break-words whitespace-pre-wrap ${
                    msg.sender === user.email
                      ? "ml-auto bg-indigo-500 text-white"
                      : "mr-auto bg-white text-black"
                  }`}
                >
                  <p>{msg.text}</p>
                  <div className="text-xs text-right mt-1 opacity-70">
                    {dayjs(msg.timestamp?.toDate()).format("HH:mm")}
                  </div>

                  {/* Message Options */}
                  <div className="absolute top-0 right-0 hidden group-hover:flex gap-2 bg-gray-500 p-1 rounded-bl-lg shadow-md">
                    <button onClick={() => handleDelete(msg.id)}>
                      <Trash2 size={16} />
                    </button>
                    <button onClick={() => handleCopy(msg.text)}>
                      <Copy size={16} />
                    </button>
                    <button onClick={() => alert("Forwarded (mock)")}>
                      <Forward size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-white flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 border rounded-full px-4 py-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSend}
            className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-full"
            disabled={!input.trim()}
          >
            <SendHorizontal />
          </button>
        </div>
      </div>
    </div>
  );
}
