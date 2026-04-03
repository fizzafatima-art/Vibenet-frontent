import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            
            // ✅ Ensure URL starts with /api
            const res = await axios.post(`${API_BASE}/api/auth/register`, {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            if (res.status === 200) {
                alert("Registration Successful! Please Login.");
                navigate('/login');
            }
        } catch (err) {
            console.error("Signup Error:", err.response?.data);
            // ✅ Better error alert
            const msg = err.response?.data?.message || err.response?.data || "Registration Failed! Connection Error.";
            alert(msg);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleRegister}>
                <h2>VibeNet</h2>
                <input type="text" placeholder="Username" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} required />
                <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                <button type="submit">Sign Up</button>
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </form>
        </div>
    );
};

export default Register;