import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // ✅ Yahan 'Link' add kar diya hai
import '../styles/Auth.css';

const Login = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const res = await axios.post(`${API_BASE}/api/auth/login`, { email, password });

            localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("token", res.data.token);
            
            setUser(res.data.user); 
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || "Login Failed!");
        }
    };
    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleLogin}>
                <h2>VibeNet Login</h2>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
                <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
            </form>
        </div>
    );
};

export default Login;