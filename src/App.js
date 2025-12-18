/**
 * App Component - Main application component with routing
 *
 * This component handles:
 * - Authentication state management
 * - Route protection based on user authentication
 * - Loading state during authentication check
 * - Navigation between login, signup, and chat pages
 */

import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

// Component imports
import Login from './components/login/Login';
import Signup from './components/signup/Signup';
import Chat from './pages/chat/Chat';

function App() {
  // Authentication state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Protected chat route - requires authentication */}
        <Route
          path='/chat'
          element={user ? <Chat /> : <Navigate to="/login" />}
        />

        {/* Public signup route - redirects to chat if already authenticated */}
        <Route
          path='/signup'
          element={!user ? <Signup /> : <Navigate to="/chat" />}
        />

        {/* Public login route - redirects to chat if already authenticated */}
        <Route
          path='/login'
          element={!user ? <Login /> : <Navigate to="/chat" />}
        />

        {/* Catch-all route - redirects based on authentication status */}
        <Route
          path="*"
          element={<Navigate to={user ? "/chat" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
