import { useState } from "react";
import { signupWithEmail, loginWithGoogle, loginWithGithub } from "../features/auth/firebaseAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signupWithEmail(email, password);
      toast.success("Account created!", { autoClose: 300 });
      navigate("/chat");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await loginWithGoogle();
      toast.success("Signed in with Google", { autoClose: 300 });
      navigate("/chat");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleGithubSignup = async () => {
    try {
      await loginWithGithub();
      toast.success("Signed in with GitHub", { autoClose: 300 });
      navigate("/chat");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form onSubmit={handleSignup} className="bg-white shadow-md rounded-md p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-indigo-600">Sign Up</h2>
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
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 mb-2">
          Create Account
        </button>

        <div className="flex flex-col space-y-2 mt-4">
          <button
            type="button"
            onClick={handleGoogleSignup}
            className="bg-red-500 hover:bg-red-600 text-white py-2 rounded"
          >
            Sign Up with Google
          </button>

          <button
            type="button"
            onClick={handleGithubSignup}
            className="bg-gray-800 hover:bg-gray-900 text-white py-2 rounded"
          >
            Sign Up with GitHub
          </button>
        </div>
      </form>
    </div>
  );
}
