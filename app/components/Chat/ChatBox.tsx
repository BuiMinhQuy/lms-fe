"use client";
import React, { useState, useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { RiRobot2Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import axios from "axios";
import { format } from "timeago.js";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
// Get chatbot URL with fallback to server URI
const CHAT_API_URL = process.env.NEXT_PUBLIC_CHATBOT_URL || "https://bmq2105.app.n8n.cloud";
console.log('CHAT_API_URL', CHAT_API_URL)
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
    const [isLoading, setIsLoading] = useState(false);
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

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!inputMessage.trim() || !userId || isLoading) return;

        const userMessage = inputMessage.trim();
        setInputMessage("");
        setIsLoading(true);

        // Add user message to chat immediately
        const userMsg: Message = {
            text: userMessage,
            senderId: userId,
            senderName: user?.name || "User",
            createdAt: new Date(),
            isOwn: true,
        };
        setMessages((prev) => [...prev, userMsg]);

        try {
            // Call chatbot API
            const response = await axios.post(
                `${CHAT_API_URL}/webhook/chatbot`,
                {
                    chatInput: userMessage,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    timeout: 30000, // 30 seconds timeout
                }
            );

            // Add AI response to chat
            if (response.data && response.data.reply) {
                const aiMessage: Message = {
                    text: response.data.reply,
                    senderId: "ai-assistant",
                    senderName: "AI Assistant",
                    createdAt: new Date(),
                    isOwn: false,
                };
                setMessages((prev) => [...prev, aiMessage]);
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error: any) {
            console.error("[CHAT] Error calling chatbot API:", error);
            
            // Add error message from AI
            const errorMessage: Message = {
                text: t("chat-error") || "Xin lỗi, tôi không thể trả lời lúc này. Vui lòng thử lại sau.",
                senderId: "ai-assistant",
                senderName: "AI Assistant",
                createdAt: new Date(),
                isOwn: false,
            };
            setMessages((prev) => [...prev, errorMessage]);
            
            // Show toast notification
            toast.error(t("chat-api-error") || "Lỗi kết nối với AI. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
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
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200 dark:border-gray-700">
                    {/* Chat Header */}
                    <div className="bg-gradient-to-r from-[#37a39a] to-[#2d8a82] text-white p-4 rounded-t-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <RiRobot2Line size={22} className="text-yellow-300" />
                            <h3 className="font-semibold">{t("ai-assistant") || "AI Assistant"}</h3>
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
                                        {!message.isOwn ? (
                                            <div className="text-sm break-words markdown-content">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                                        strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                                                        em: ({ children }) => <em className="italic">{children}</em>,
                                                        ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                                                        ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                                                        li: ({ children }) => <li className="ml-2">{children}</li>,
                                                        h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                                                        h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                                                        h3: ({ children }) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
                                                        code: ({ children }) => <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded text-xs">{children}</code>,
                                                        pre: ({ children }) => <pre className="bg-gray-200 dark:bg-gray-600 p-2 rounded text-xs overflow-x-auto mb-2">{children}</pre>,
                                                    }}
                                                >
                                                    {message.text}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            <p className="text-sm break-words">{message.text}</p>
                                        )}
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
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!inputMessage.trim() || isLoading}
                                className="px-6 py-2 bg-[#37a39a] text-white rounded-lg hover:bg-[#2d8a82] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-[80px]"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    t("send") || "Send"
                                )}
                            </button>
                        </div>
                        {isLoading && (
                            <p className="text-xs text-blue-500 mt-2 flex items-center gap-1">
                                <RiRobot2Line size={14} className="animate-pulse" />
                                {t("ai-thinking") || "AI đang suy nghĩ..."}
                            </p>
                        )}
                    </form>
                </div>
            )}
        </>
    );
};

export default ChatBox;
