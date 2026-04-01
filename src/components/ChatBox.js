import React, { useState, useEffect, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import axios from 'axios';

const ChatBox = ({ receiver, socket }) => {
    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]);
    const [showEmoji, setShowEmoji] = useState(false);
    const scrollRef = useRef();

    // ✅ Safe parsing
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");

    // 1. Fetch old messages
    useEffect(() => {
        const getMessages = async () => {
            try {
                const url = `${process.env.REACT_APP_API_URL}/messages/${currentUser?._id}/${receiver?._id}`;
                const res = await axios.get(url);
                setMessages(res.data || []);
            } catch (err) {
                console.log("Error fetching messages:", err);
            }
        };

        if (receiver?._id && currentUser?._id) {
            getMessages();
        }
    }, [receiver, currentUser]);

    // 2. Real-time receive
    useEffect(() => {
        if (!socket) return;

        const handleReceive = (data) => {
            // ✅ Proper filtering
            if (
                (data.sender === receiver?._id && data.receiver === currentUser?._id)
            ) {
                setMessages((prev) => [...prev, data]);
            }
        };

        socket.on('receive_message', handleReceive);

        return () => socket.off('receive_message', handleReceive);
    }, [socket, receiver, currentUser]);

    // 3. Auto scroll
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const onEmojiClick = (emojiData) => {
        setText(prev => prev + emojiData.emoji);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!text.trim() || !receiver?._id || !currentUser?._id) return;

        const msgData = {
            sender: currentUser._id,
            receiver: receiver._id,
            text: text,
            createdAt: new Date()
        };

        // ✅ Optimistic UI
        setMessages((prev) => [...prev, msgData]);
        setText("");

        // ✅ Socket send
        if (socket?.connected) {
            socket.emit('send_message', msgData);
        }

        // ✅ API call (dynamic URL)
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/messages`, msgData);
        } catch (err) {
            console.log("DB Save Error:", err);
        }
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#000' }}>

            {/* Header */}
            <div style={{ padding: '15px', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img
                    src={receiver?.profilePic || 'https://via.placeholder.com/35'}
                    style={{ width: '35px', height: '35px', borderRadius: '50%' }}
                    alt="profile"
                />
                <div>
                    <h4 style={{ color: 'white', margin: 0 }}>
                        {receiver?.username || "User"}
                    </h4>
                    <span style={{ fontSize: '10px', color: '#8a2be2' }}>
                        24h Mode Active ⏳
                    </span>
                </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                {messages.map((m, i) => (
                    <div
                        key={i}
                        style={{
                            textAlign: m.sender === currentUser?._id ? 'right' : 'left',
                            marginBottom: '12px'
                        }}
                    >
                        <span style={{
                            background: m.sender === currentUser?._id ? '#8a2be2' : '#222',
                            padding: '10px 14px',
                            borderRadius: '18px',
                            color: 'white',
                            display: 'inline-block',
                            maxWidth: '75%',
                        }}>
                            {m.text}
                        </span>
                    </div>
                ))}
                <div ref={scrollRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} style={{ padding: '20px', display: 'flex', gap: '10px', position: 'relative', borderTop: '1px solid #222' }}>
                <button type="button" onClick={() => setShowEmoji(!showEmoji)} style={{ background: 'none', border: 'none', fontSize: '22px' }}>
                    😊
                </button>

                {showEmoji && (
                    <div style={{ position: 'absolute', bottom: '100%', left: '20px', zIndex: 10 }}>
                        <EmojiPicker onEmojiClick={onEmojiClick} theme="dark" />
                    </div>
                )}

                <input
                    style={{ flex: 1, padding: '12px', borderRadius: '25px', border: '1px solid #333', background: '#111', color: 'white' }}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a vibe..."
                />

                <button type="submit" style={{ padding: '10px 20px', borderRadius: '25px', background: '#8a2be2', color: 'white', border: 'none' }}>
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatBox;