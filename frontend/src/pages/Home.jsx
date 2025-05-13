import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center flex-col bg-gray-50">
      <h1 className="text-3xl font-bold text-indigo-600">Welcome to ConnectSphere!</h1>
      {user ? (
        <p className="mt-4 text-gray-700">Logged in as: <strong>{user.email}</strong></p>
      ) : (
        <p className="mt-4 text-gray-600">You are not logged in.</p>
      )}
    </div>
  );
}
