import React, { useState, useRef } from 'react';
import { getDatabase, ref, query, orderByChild, onValue, push, serverTimestamp, equalTo } from "firebase/database";
import { initializeApp } from "firebase/app";
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './chatroom.css'

const firebaseConfig = {
    apiKey: "AIzaSyBaUVMp53AyYCAbaFuO2jNEAn7ba5V0Rco",
    authDomain: "newproject-a9f9b.firebaseapp.com",
    projectId: "newproject-a9f9b",
    storageBucket: "newproject-a9f9b.appspot.com",
    messagingSenderId: "713852852186",
    appId: "1:713852852186:web:06c6d4a3da6bb3dd9312e3",
    measurementId: "G-21KFG873H8",
    databaseURL: "https://newproject-a9f9b-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const ChatPage = () => {
   
   
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const location = useLocation();
    const { state } = location; 
    const { yourName, roomId, roomName } = state || {};
    const chatListRef = useRef(null);
   
  
    

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };
    
    const handleSend = () => {
          if (message) {
            const newChat = {
            username : yourName,
            message: message,
            roomId : roomId,
            roomName : roomName,    
            timestamp: serverTimestamp(),
        };

        // setChatHistory([...chatHistory,newChat]);

        push(ref(db, `messages`), newChat);

        
        setMessage('');
        }
    };


    const getChatHistory = async () => {
        let filteredMessages = query(ref(db, 'messages'), orderByChild('roomId'), equalTo(roomId));
        onValue(filteredMessages, (snapshot) => {
            const data = snapshot.val();
            console.log(data);
            let messageMap = Object.entries(data);
            let messageList = Array.from(messageMap.values());
            console.log(messageList);
            setChatHistory(messageList);
            scrollToBottom();
          });
    }

    const scrollToBottom = () => {
        if (chatListRef.current) {
            chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        
        getChatHistory()}, []);

    return (
        <div className='chat-container'>
        <div className='chatroom'>
        <div className="room-header">
            <h2>{roomName}</h2>
        </div>
            {chatHistory.length === 0 ? (
                <p className="no-messages">No messages yet...</p>
            ) : (
                <ul ref={chatListRef} className="message-list">
                    {chatHistory.map((chat, index) => (
                        <li key={index} className={chat[1].username === yourName ? 'sent' : 'received'}>
                            <div className='message-container'>
                                <strong className='name'>{chat[1].username} :</strong>
                                {chat[1].message}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
        <div className='messagediv'>
            <label className='label'>Message:</label>
            <input className='input' type="text" value={message} onChange={handleMessageChange} />
            <button className='send' onClick={handleSend}>Send</button>
        </div>
    </div>

    
    );
};

export default ChatPage;
