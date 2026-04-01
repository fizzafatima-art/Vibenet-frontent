import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io.connect(process.env.REACT_APP_SOCKET_URL || "http://localhost:5000");

const Chat = ({ currentUser, receiver }) => {
    const [message, setMessage] = useState("");
    const [chatLog, setChatLog] = useState([]);

    useEffect(() => {
        socket.emit("join_room", currentUser._id);
        
        // Fetch old messages
        const fetchMsgs = async () => {
            const res = await axios.get(`/api/messages/${currentUser._id}/${receiver._id}`);
            setChatLog(res.data);
        };
        fetchMsgs();
    }, [receiver]);

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setChatLog((prev) => [...prev, data]);
        });
    }, []);

    const sendMsg = async () => {
        const msgData = { sender: currentUser._id, receiver: receiver._id, text: message };
        await socket.emit("send_message", msgData);
        await axios.post('/api/messages/send', msgData); // Save to DB
        setChatLog((prev) => [...prev, msgData]);
        setMessage("");
    };

    return (
        <div className="chat-box">
            <div className="messages">
                {chatLog.map((m, i) => (
                    <p key={i} className={m.sender === currentUser._id ? "own" : "other"}>
                        {m.text}
                    </p>
                ))}
            </div>
            <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." />
            <button onClick={sendMsg}>Send</button>
        </div>
    );
};

export default Chat;