"use client";
import React, { useState, useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { RiRobot2Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import socket from "@/app/utils/socket";
import { format } from "timeago.js";
import { useTranslation } from "react-i18next";

interface Message {
    _id?: string;
    text: string;
    senderId: string;
    senderName?: string;
    createdAt?: Date | string;
    isOwn?: boolean;
}

const ChatBox: React.FC = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { user } = useSelector((state: any) => state.auth);
    const userId = user?._id;

    // Scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Socket connection status
    useEffect(() => {
        const handleConnect = () => {
            setIsConnected(true);
            console.log("[CHAT] Socket connected");
            
            // Join chat room when connected
            if (userId) {
                socket.emit("joinChatRoom", userId);
            }
        };

        const handleDisconnect = () => {
            setIsConnected(false);
            console.log("[CHAT] Socket disconnected");
        };

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);

        // Check initial connection status
        setIsConnected(socket.connected);

        // Connect socket if not connected
        if (!socket.connected) {
            socket.connect();
        }

        // Join chat room on mount if user is logged in
        if (userId && socket.connected) {
            socket.emit("joinChatRoom", userId);
        }

        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
        };
    }, [userId]);

    // Listen for messages
    useEffect(() => {
        const handleNewMessage = (message: Message) => {
            // Mark message as own if senderId matches current user
            const isOwnMessage = message.senderId === userId;
            setMessages((prev) => [
                ...prev,
                {
                    ...message,
                    isOwn: isOwnMessage,
                },
            ]);
        };

        socket.on("newChatMessage", handleNewMessage);

        // Load chat history when opening chat (if available)
        if (isOpen && userId) {
            socket.emit("getChatHistory", userId);
        }

        socket.on("chatHistory", (history: Message[]) => {
            const formattedHistory = history.map((msg) => ({
                ...msg,
                isOwn: msg.senderId === userId,
            }));
            setMessages(formattedHistory);
        });

        return () => {
            socket.off("newChatMessage", handleNewMessage);
            socket.off("chatHistory");
        };
    }, [isOpen, userId]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!inputMessage.trim() || !userId) return;

        const newMessage: Message = {
            text: inputMessage.trim(),
            senderId: userId,
            senderName: user?.name || "User",
            createdAt: new Date(),
            isOwn: true,
        };

        // Emit message to server
        socket.emit("sendChatMessage", {
            text: newMessage.text,
            senderId: userId,
            senderName: newMessage.senderName,
        });

        // Add message to local state immediately for better UX
        setMessages((prev) => [...prev, newMessage]);
        
        setInputMessage("");
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    if (!userId) {
        return null; // Don't show chat if user is not logged in
    }

    return (
        <>
            {/* Floating Chat Button */}
            <button
                onClick={toggleChat}
                className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-[#37a39a] to-[#2d8a82] hover:from-[#2d8a82] hover:to-[#37a39a] text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-all duration-300 ${
                    isOpen ? "hidden" : "flex"
                }`}
                aria-label="Open AI Assistant"
            >
                <RiRobot2Line size={26} />
                {!isConnected && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200 dark:border-gray-700">
                    {/* Chat Header */}
                    <div className="bg-gradient-to-r from-[#37a39a] to-[#2d8a82] text-white p-4 rounded-t-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <RiRobot2Line size={22} className="text-yellow-300" />
                            <h3 className="font-semibold">{t("ai-assistant") || "AI Assistant"}</h3>
                            <span
                                className={`w-2 h-2 rounded-full ${
                                    isConnected ? "bg-green-400" : "bg-red-400"
                                }`}
                            ></span>
                        </div>
                        <button
                            onClick={toggleChat}
                            className="hover:bg-white/20 rounded-full p-1 transition-colors"
                            aria-label="Close chat"
                        >
                            <IoMdClose size={20} />
                        </button>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
                        {messages.length === 0 ? (
                            <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
                                <RiRobot2Line size={48} className="mx-auto mb-4 text-[#37a39a] opacity-50" />
                                <p className="font-medium mb-2">{t("ai-assistant-welcome") || "Chat with our AI Assistant"}</p>
                                <p className="text-sm">{t("no-messages") || "Start a conversation to get help!"}</p>
                            </div>
                        ) : (
                            messages.map((message, index) => (
                                <div
                                    key={message._id || index}
                                    className={`flex ${
                                        message.isOwn ? "justify-end" : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`max-w-[75%] rounded-lg p-3 ${
                                            message.isOwn
                                                ? "bg-[#37a39a] text-white"
                                                : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        }`}
                                    >
                                        {!message.isOwn && (
                                            <div className="flex items-center gap-1 mb-1">
                                                <RiRobot2Line size={14} className="text-yellow-300" />
                                                <p className="text-xs font-semibold opacity-75">
                                                    {message.senderName || "AI Assistant"}
                                                </p>
                                            </div>
                                        )}
                                        <p className="text-sm break-words">{message.text}</p>
                                        {message.createdAt && (
                                            <p className="text-xs mt-1 opacity-75">
                                                {format(message.createdAt)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Form */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder={t("type-message") || "Type a message..."}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37a39a] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                disabled={!isConnected}
                            />
                            <button
                                type="submit"
                                disabled={!inputMessage.trim() || !isConnected}
                                className="px-6 py-2 bg-[#37a39a] text-white rounded-lg hover:bg-[#2d8a82] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                                {t("send") || "Send"}
                            </button>
                        </div>
                        {!isConnected && (
                            <p className="text-xs text-red-500 mt-2">
                                {t("connecting") || "Connecting..."}
                            </p>
                        )}
                    </form>
                </div>
            )}
        </>
    );
};

export default ChatBox;
