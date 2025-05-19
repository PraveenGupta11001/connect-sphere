import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import userIcon from '../assets/user-286.png'
import {ArrowLeft} from 'lucide-react'

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

  if (!user) return <div>Loading...</div>;

  const filteredUsers = users
    .filter((u) => u.uid !== user.uid)
    .filter((u) =>
      u.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="pt-20 px-4 max-w-3xl mx-auto">
      <div className="flex items-center">
        <Link to="/" className="-mt-5"><ArrowLeft size={25} className="text-gray-500" /></Link>
        <div className="mb-4 relative max-w-xs">
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full rounded-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      

      {filteredUsers.length === 0 ? (
        <p className="text-gray-500 text-center">No users found.</p>
      ) : (
        filteredUsers.map((u) => (
          <Link key={u.uid} to={`/chat/${u.uid}`}>
            <div className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-2 mx-6 max-w-6xl cursor-pointer">
              <img
                src={u.photoURL || userIcon}
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="font-medium">{u.displayName || "Unnamed User"}</h3>
                <p className="text-gray-500 text-sm">{u.email}</p>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
