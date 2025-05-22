import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import userIcon from '../assets/user-286.png';
import { ArrowLeft } from 'lucide-react';

export default function Chat() {
  const user = useSelector((state) => state.auth.user);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredUsers = users
    .filter((u) => u.uid !== user.uid)
    .filter((u) =>
      (u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       u.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  return (
    <div className="p-8 flex-1 overflow-y-auto bg-white" style={{ maxHeight: "75vh" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="fixed top-16 left-0 right-0 z-10 bg-white shadow-lg p-4">
          <div className="flex items-center gap-4 max-w-4xl mx-auto">
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

        <div className="mt-24">
          {filteredUsers.length === 0 ? (
            <p className="text-gray-500 text-center text-sm font-medium py-8">No users found.</p>
          ) : (
            filteredUsers.map((u) => (
              <Link key={u.uid} to={`/chat/${u.uid}`}>
                <div className="flex items-center gap-3 hover:bg-gray-100 rounded-xl p-3 mx-2 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer">
                  <img
                    src={u.photoURL || userIcon}
                    alt="avatar"
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-base truncate">{u.displayName || "Unnamed User"}</h3>
                    <p className="text-gray-500 text-sm truncate">{u.email}</p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}