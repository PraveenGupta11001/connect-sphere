// src/pages/Login.jsx
import { useState } from "react";
import { loginWithEmail } from "../features/auth/firebaseAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";  // <-- fixed import here

export const saveUserToFirestore = async (user) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, {
    email: user.email,
    displayName: user.displayName || user.email,
    photoURL: user.photoURL || "",
  }, { merge: true });
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginWithEmail(email, password);
      toast.success("Logged in!");
      navigate("/chat");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form onSubmit={handleLogin} className="bg-white shadow-md rounded-md p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-indigo-600">Login</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
          Login
        </button>
      </form>
    </div>
  );
}
