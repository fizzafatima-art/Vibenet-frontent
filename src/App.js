import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';
import { io } from "socket.io-client";

// ✅ Initialize socket once
const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');

function App() {
  const [user, setUser] = useState(null);

  // ✅ Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(storedUser);
  }, []);

  // ✅ Join socket room
  useEffect(() => {
    if (user?._id) {
      socket.emit("join", user._id);
    }
  }, [user]);

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // ✅ Delete Account
  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure? Your vibe will be gone forever!")) {
      try {
        // TODO: backend API call
        localStorage.removeItem('user');
        setUser(null);
        alert("Account deleted successfully.");
      } catch (err) {
        console.log("Delete error:", err);
      }
    }
  };

  // ✅ Layout Wrapper
  const AppLayout = ({ children }) => (
    <div className="main-layout" style={{ display: 'flex' }}>
      <div style={{ width: '250px' }}>
        <Sidebar user={user} onLogout={handleLogout} />
      </div>

      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>

        {/* Auth Routes */}
        <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={user ? <AppLayout><Home /></AppLayout> : <Navigate to="/login" />}
        />

        <Route
          path="/messages"
          element={user ? <AppLayout><Messages socket={socket} /></AppLayout> : <Navigate to="/login" />}
        />

        <Route
          path="/profile"
          element={
            user ? (
              <AppLayout>
                <Profile
                  user={user}
                  onLogout={handleLogout}
                  onDelete={handleDeleteAccount}
                />
              </AppLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;