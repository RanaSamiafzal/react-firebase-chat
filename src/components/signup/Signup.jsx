/**
 * Signup Component - User registration interface
 *
 * This component handles user account creation with:
 * - Email and password registration
 * - Automatic user profile creation in Firestore
 * - Default avatar generation
 * - User status initialization
 */

import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

function Signup() {
  // Form state management
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  /**
   * Handle user registration
   * Creates Firebase Auth account and Firestore user document
   * @param {Event} e - Form submit event
   */
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;

      // Create user document in Firestore with default profile data
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.email.split('@')[0], // Derive displayName from email prefix
        photoURL: `https://ui-avatars.com/api/?name=${user.email.split('@')[0].charAt(0)}&background=random&color=fff&size=40`,
        status: 'active',
        createdAt: serverTimestamp(),
      });

      navigate('/chat');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
      <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h2>

        {/* Registration Form */}
        <form className="space-y-5" onSubmit={handleSignup}>
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 font-medium shadow-md"
          >
            Sign Up
          </button>
        </form>

        {/* Login Redirect */}
        <p onClick={() => navigate("/login")} className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <span className="text-purple-600 font-semibold cursor-pointer hover:underline">
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
