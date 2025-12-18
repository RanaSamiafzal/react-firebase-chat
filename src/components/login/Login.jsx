
/**
 * Login Component - Authentication interface for user login
 *
 * This component provides login functionality through:
 * - Email and password authentication
 * - Google OAuth authentication
 * - Automatic user profile creation in Firestore
 * - User status management
 */

import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore";

function Login() {
  // Form state management
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Initialize Google Auth Provider
  const googleProvider = new GoogleAuthProvider();

  /**
   * Handle Google OAuth login
   * Creates or updates user document in Firestore with profile information
   */
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("User logged in:", user);

      // Check if user exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      console.log("User document exists:", userDoc.exists());

      if (!userDoc.exists()) {
        console.log("Creating new user document");
        // Create new user document with Google profile data
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0],
          photoURL: user.photoURL,
          status: 'active',
          createdAt: serverTimestamp(),
        });
        console.log("New user document created");
      } else {
        console.log("Updating existing user status");
        // Update existing user status to active
        await updateDoc(userDocRef, {
          status: 'active',
        });
        console.log("User status updated");
      }
      navigate("/chat");
    } catch (error) {
      console.error("Google login error:", error);
      alert(error.message);
    }
  };

  /**
   * Handle email and password login
   * Creates user document if it doesn't exist and updates status
   * @param {Event} e - Form submit event
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // Check if user exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Create new user document for email/password login
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.email.split('@')[0],
          photoURL: `https://ui-avatars.com/api/?name=${user.email.split('@')[0].charAt(0)}&background=random&color=fff&size=40`,
          status: 'active',
          createdAt: serverTimestamp(),
        });
      } else {
        // Update existing user status to active
        await updateDoc(userDocRef, {
          status: 'active',
        });
      }

      navigate("/chat");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-indigo-500 p-4">
      <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back
        </h2>

        {/* Email/Password Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-purple-700 transition duration-200 font-medium shadow-md"
          >
            Log In
          </button>
        </form>

        {/* OR Separator */}
        <div className="flex justify-center mt-4">
          <span className="text-gray-700 font-medium">OR</span>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full mt-4 flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="text-gray-700 font-medium">Sign in with Google</span>
        </button>

        {/* Signup Redirect */}
        <p
          onClick={() => navigate("/signup")}
          className="text-center text-gray-600 mt-6 cursor-pointer"
        >
          Don't have an account?{" "}
          <span className="text-purple-700 font-semibold hover:underline">
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
