import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  MoreVertical,
  Search,
  SendHorizontal,
  Trash2,
  Copy,
  Forward,
  X,
} from "lucide-react";
import dayjs from "dayjs";
import userIcon from "../assets/user-286.png";
import { sendMessage, fetchMessages } from "../features/chat/chatService";
import { useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, getDoc, deleteDoc, collection, getDocs } from "firebase/firestore";

export default function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatSearch, setChatSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [receiverInfo, setReceiverInfo] = useState(null);
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, messageId: null });
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ visible: false, messageId: null });
  const [deleteNotification, setDeleteNotification] = useState(false);
  const messageContainerRef = useRef(null);
  const sidebarRef = useRef(null);

  const user = useSelector((state) => state.auth.user);
  const { chatUserId } = useParams();
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 768;

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

  // Filter conversations for sidebar search
  const filteredConversations = conversations.filter((conv) =>
    (conv.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     conv.email?.toLowerCase().includes(searchTerm.toLowerCase()))
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

  // Auto-scroll for messages
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
    const message = messages.find((msg) => msg.id === id);
    if (message.sender !== user.email) {
      alert("You can only delete your own messages.");
      return;
    }

    try {
      await deleteDoc(doc(db, "messages", id));
      setDeleteConfirmation({ visible: false, messageId: null });
      setDeleteNotification(true);
      setTimeout(() => setDeleteNotification(false), 2000);
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Failed to delete message.");
    }
  };

  const handleCopy = (text) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleContextMenu = (e, messageId) => {
    e.preventDefault();
    if (isMobile) {
      const touchX = e.clientX || e.touches[0]?.clientX;
      const touchY = e.clientY || e.touches[0]?.clientY;
      const menuWidth = 120;
      const menuHeight = 100;
      let adjustedX = touchX;
      let adjustedY = touchY;

      if (touchX + menuWidth > window.innerWidth) {
        adjustedX = window.innerWidth - menuWidth - 10;
      }
      if (touchY + menuHeight > window.innerHeight) {
        adjustedY = window.innerHeight - menuHeight - 10;
      }

      setContextMenu({
        visible: true,
        x: adjustedX,
        y: adjustedY,
        messageId,
      });
    }
  };

  const handleTouchStart = (e, messageId) => {
    e.preventDefault();
    const touchTimeout = setTimeout(() => {
      handleContextMenu(e, messageId);
    }, 500);
    return () => clearTimeout(touchTimeout);
  };

  const handleTouchEnd = () => {
    setTimeout(() => {
      setContextMenu({ visible: false, x: 0, y: 0, messageId: null });
    }, 200);
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, messageId: null });
  };

  const handleOutsideClick = (e) => {
    if (deleteConfirmation.visible && !e.target.closest('.confirmation-dialog')) {
      setDeleteConfirmation({ visible: false, messageId: null });
    }
    if (contextMenu.visible && !e.target.closest('.message-content')) {
      setContextMenu({ visible: false, x: 0, y: 0, messageId: null });
    }
  };

  const handleBackClick = () => {
    if (isMobile) {
      navigate("/chat");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 min-h-screen bg-gray-50 pt-16" onClick={handleOutsideClick}>
      {/* Sidebar (Chat List) - Only on larger screens */}
      {!isMobile && (
        <div
          ref={sidebarRef}
          className="flex flex-col p-4 border-r border-gray-200 bg-white"
          style={{ height: "calc(100vh - 64px)" }}
        >
          <div className="fixed w-[33.3%] lg:w-[25.2%] xl:w-[27%] xl:left-[8%] lg:left-[9%] pl-2 pt-3 pr-2 top-16 left-0 z-10 bg-white pb-4">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center">
                <ArrowLeft size={24} className="text-gray-600 hover:text-indigo-600 transition-colors" />
              </Link>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div
            className="space-y-2 mt-24 overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 180px - 64px)" }}
          >
            {filteredConversations.length === 0 ? (
              <p className="text-gray-500 text-center text-sm font-medium py-8">No users found.</p>
            ) : (
              filteredConversations.map((conv) => (
                <Link
                  key={conv.uid}
                  to={`/chat/${conv.uid}`}
                  className={`flex items-center gap-3 p-3 rounded-xl ${
                    chatUserId === conv.uid ? "bg-gray-200" : "hover:bg-gray-100"
                  } transition-all duration-200`}
                >
                  <img
                    src={conv.photoURL || userIcon}
                    alt=""
                    className="h-12 w-12 rounded-full object-cover border-2 border-gray-100"
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
                </Link>
              ))
            )}
          </div>
        </div>
      )}

      {/* Chat Panel */}
      <div className={`col-span-1 md:col-span-2 flex flex-col bg-gray-100 ${chatUserId ? 'flex' : 'hidden md:flex'} w-full`}>
        {/* Header */}
        <div className="fixed top-16 left-0 right-0 md:left-[33.3%] lg:left-[35.8%] lg:right-[7.5%] z-20 bg-white shadow-md p-4">
          <div className="flex items-center justify-between max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 z-30">
              <button onClick={handleBackClick}>
                <ArrowLeft size={24} className="text-gray-600 hover:text-indigo-600 transition-colors" />
              </button>
              {receiverInfo && (
                <>
                  <img
                    src={receiverInfo?.photoURL || userIcon}
                    alt="User"
                    className="h-10 w-10 rounded-full object-cover border-2 border-gray-100"
                  />
                  <h2 className="text-lg font-semibold text-gray-900">
                    {receiverInfo?.uid === user.uid ? "You (Self)" : (receiverInfo?.displayName || "User")}
                  </h2>
                </>
              )}
            </div>

            {/* Triple Dot Menu */}
            <div className="relative z-30">
              <button onClick={() => setShowMenu(!showMenu)} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                <MoreVertical size={24} className="text-gray-600 hover:text-indigo-600 transition-colors" />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl p-2 border border-gray-100 z-40">
                  <button
                    className="w-full px-4 py-2.5 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium"
                    onClick={() => {
                      setShowSearch(true);
                      setShowMenu(false);
                    }}
                  >
                    <Search size={16} />
                    Search in chat
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search bar (only when enabled) */}
        {showSearch && (
          <div className="fixed top-32 left-0 right-0 md:left-[33.3%] lg:left-[35.8%] lg:right-[7.5%] z-20 bg-white shadow-md px-4 sm:px-6 lg:px-8 py-3 border-b">
            <div className="max-w-5xl mx-auto flex items-center gap-3">
              <input
                type="text"
                placeholder="Search messages..."
                value={chatSearch}
                onChange={(e) => setChatSearch(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
              />
              <button
                onClick={() => {
                  setShowSearch(false);
                  setShowMenu(false);
                }}
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        )}

        {/* Messages */}
        <div
          ref={messageContainerRef}
          className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3 mt-16 md:mt-16"
          style={{ maxHeight: "calc(100vh - 260px)" }}
        >
          {filteredMessages.map((msg, index) => {
            const msgDate = msg.timestamp?.toDate();
            const showDate = formatDate(msgDate) !== lastDate;
            if (showDate) lastDate = formatDate(msgDate);

            const isSender = msg.sender === user.email;

            return (
              <div key={msg.id}>
                {showDate && (
                  <div className="text-center text-gray-500 text-sm font-medium my-4">
                    <span className="bg-gray-200 px-3 py-1 rounded-full">{lastDate}</span>
                  </div>
                )}

                <div
                  className={`relative max-w-[80%] sm:max-w-[70%] break-words whitespace-pre-wrap ${
                    isSender ? "ml-auto" : "mr-auto"
                  } group`}
                >
                  <div
                    className={`message-content p-4 rounded-xl shadow-md ${
                      isSender ? "bg-indigo-500 text-white" : "bg-white text-gray-900"
                    }`}
                    onContextMenu={(e) => handleContextMenu(e, msg.id)}
                    onTouchStart={(e) => handleTouchStart(e, msg.id)}
                    onTouchEnd={handleTouchEnd}
                  >
                    <p className="text-sm sm:text-base">{msg.text}</p>
                    <div className="text-xs text-right mt-1 opacity-80">
                      {dayjs(msg.timestamp?.toDate()).format("HH:mm")}
                    </div>
                  </div>

                  {/* Desktop Message Options */}
                  <div className={`absolute top-0 right-0 hidden md:group-hover:flex gap-2 bg-gray-600 p-1.5 rounded-bl-lg shadow-md z-10`}>
                    <button onClick={() => handleCopy(msg.text)} className="text-white hover:text-indigo-300 transition-colors">
                      <Copy size={16} />
                    </button>
                    {isSender && (
                      <button
                        onClick={() => setDeleteConfirmation({ visible: true, messageId: msg.id })}
                        className="text-white hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                    <button onClick={() => alert("Forwarded (mock)")} className="text-white hover:text-indigo-300 transition-colors">
                      <Forward size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="p-4 sm:p-6 border-t bg-white shadow-inner flex items-center gap-3">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSend}
            className="bg-indigo-500 hover:bg-indigo-600 text-white p-2.5 rounded-full transition-colors disabled:opacity-50"
            disabled={!input.trim()}
          >
            <SendHorizontal size={20} />
          </button>
        </div>

        {/* Mobile Context Menu */}
        {contextMenu.visible && (
          <div
            className="fixed bg-white shadow-md rounded-lg p-2 z-30 transform transition-all duration-200 ease-in-out"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <button
              onClick={() => {
                const message = messages.find((msg) => msg.id === contextMenu.messageId);
                handleCopy(message.text);
                handleCloseContextMenu();
              }}
              className="w-full px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg flex items-center gap-2 transition-colors text-sm"
            >
              <Copy size={16} />
              Copy
            </button>
            {messages.find((msg) => msg.id === contextMenu.messageId)?.sender === user.email && (
              <button
                onClick={() => {
                  setDeleteConfirmation({ visible: true, messageId: contextMenu.messageId });
                  handleCloseContextMenu();
                }}
                className="w-full px-4 py-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg flex items-center gap-2 transition-colors text-sm"
              >
                <Trash2 size={16} />
                Delete
              </button>
            )}
          </div>
        )}

        {/* Copied Notification */}
        {copiedNotification && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-700 text-white px-4 py-2 rounded-lg shadow-md z-40">
            Copied
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {deleteConfirmation.visible && (
          <div className="fixed inset-0 bg-gray-200 bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 shadow-lg max-w-sm w-full border border-gray-100 confirmation-dialog">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Are you sure you want to delete this message?</h3>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmation({ visible: false, messageId: null })}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmation.messageId)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Notification */}
        {deleteNotification && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-700 text-white px-4 py-2 rounded-lg shadow-md z-40">
            Message Deleted
          </div>
        )}
      </div>
    </div>
  );
}