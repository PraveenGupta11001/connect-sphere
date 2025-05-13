import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-indigo-600">ConnectSphere</Link>
        <nav className="space-x-4">
          <Link to="/" className="text-gray-700 hover:text-indigo-600">Home</Link>
          <Link to="/chat" className="text-gray-700 hover:text-indigo-600">Chat</Link>
          <Link to="/login" className="text-gray-700 hover:text-indigo-600">Login</Link>
          <Link to="/signup" className="text-indigo-600 font-semibold">Sign Up</Link>
        </nav>
      </div>
    </header>
  );
}
