"use client";

import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io(`${process.env.NEXT_PUBLIC_API_URL || 'https://local-service-provider-aec-4th-sem.onrender.com'}`);

export default function ChatWindow({ requestId, userId, userRole, recipientName }) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Join room
    socket.emit("join_room", requestId);

    // Fetch message history
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://local-service-provider-aec-4th-sem.onrender.com'}/api/chat/${requestId}`)
      .then((res) => res.json())
      .then((data) => setChat(data))
      .catch((err) => console.error("Error fetching chat history:", err));

    // Listen for incoming messages
    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [requestId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const messageData = {
        requestId,
        senderId: userId,
        senderRole: userRole,
        content: message,
      };
      socket.emit("send_message", messageData);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-3xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 flex items-center justify-between text-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg uppercase">
            {recipientName?.charAt(0) || "P"}
          </div>
          <div>
            <h3 className="font-semibold text-sm leading-tight">{recipientName || "Service Provider"}</h3>
            <span className="text-[10px] opacity-80 flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
              Online
            </span>
          </div>
        </div>
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
        {chat.length === 0 && (
          <div className="text-center py-10 opacity-40 italic text-sm">
            No messages yet. Say hello!
          </div>
        )}
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl shadow-sm text-sm transition-all duration-200 hover:scale-[1.02] ${
                msg.senderId === userId
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
              }`}
            >
              <p className="leading-relaxed">{msg.content}</p>
              <span className={`text-[10px] mt-1 block opacity-60 ${msg.senderId === userId ? "text-right" : "text-left"}`}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100 flex items-center space-x-3">
        <div className="flex-1 relative">
          <input
            type="text"
            className="w-full bg-gray-100 border-none rounded-full py-2.5 px-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={!message.trim()}
          className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
