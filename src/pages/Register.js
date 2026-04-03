import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Environment variable se URL uthayega, warna localhost
            const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            
            const res = await axios.post(`${API_BASE}/api/auth/register`, formData);

            if (res.status === 200 || res.status === 201) {
                alert("Registration Successful! Now Login.");
                navigate('/login');
            }
        } catch (err) {
            console.error("Signup Error:", err.response?.data);
            const errorMsg = err.response?.data?.message || "Connection Error: Check if Backend is up!";
            alert(errorMsg);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleRegister}>
                <h2>VibeNet</h2>
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={formData.username} 
                    onChange={(e) => setFormData({...formData, username: e.target.value})} 
                    required 
                />
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={formData.password} 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    required 
                />
                <button type="submit">Sign Up</button>
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </form>
        </div>
    );
};

export default Register;