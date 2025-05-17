import React from 'react';
import reactLogo from '../assets/react.svg';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function Chat() {
  return (
    <div className="my-4 px-4 pt-20">

      {/* Mobile-only search bar */}
      <div className="mb-4 relative max-w-xs">
        <input
          type="text"
          placeholder="Search chats..."
          className="w-full rounded-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
        />
        <Search size={20} className="absolute right-4 top-2.5 text-gray-500" />
      </div>

      {/* Chat list item */}
      <Link to="/chat/chatrm">
        <div className="flex gap-2 hover:bg-gray-100 rounded-lg p-2 transition mx-6 max-w-6xl">
          <div className="rounded-full h-12 w-12 text-center p-1 border bg-white shadow">
            <img src={reactLogo} alt="react logo" className="h-full w-full rounded-full" />
          </div>
          <div className="w-[80%]">
            <h3 className="font-medium text-[18px]">Simon Lamacy</h3>
            <span className="text-gray-600 text-sm">Hi, Linday Good Morning!</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
