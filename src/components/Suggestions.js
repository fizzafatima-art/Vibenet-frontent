import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Suggestions = ({ setSelectedChat }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Testing ke liye localhost direct use kar rahe hain
                console.log("Attempting to fetch from backend...");
                const res = await axios.get("http://localhost:5000/api/users/suggestions");
                
                console.log("Raw Data received:", res.data);

                if (res.data && res.data.length > 0) {
                    // FILTER REMOVED: Sab users dikhayein (even Hassan) testing ke liye
                    setUsers(res.data);
                } else {
                    console.log("Backend connection success, but DB is EMPTY.");
                }
            } catch (err) {
                console.error("Axios Error Details:", err.response || err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div style={{ color: 'white', padding: '10px' }}>
            <h3 style={{ color: '#8a2be2', marginBottom: '15px' }}>Suggested Friends</h3>
            {loading ? <p>Loading vibes...</p> : (
                users.length > 0 ? (
                    users.map(u => (
                        <div key={u._id} onClick={() => setSelectedChat?.(u)} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', background: '#111', padding: '10px', borderRadius: '10px', border: '1px solid #222' }}>
                            <img src={u.profilePic || 'https://via.placeholder.com/35'} style={{ width: '35px', height: '35px', borderRadius: '50%' }} alt="" />
                            <span style={{ fontSize: '14px' }}>{u.username}</span>
                        </div>
                    ))
                ) : (
                    <div style={{ color: '#444', fontSize: '12px' }}>
                        <p>No data in DB or Route Mismatch.</p>
                        <p>Check: https://vibe-net-backend-fizzafatima-arts-projects.vercel.app/api/users/suggestions in new tab</p>
                    </div>
                )
            )}
        </div>
    );
};

export default Suggestions;