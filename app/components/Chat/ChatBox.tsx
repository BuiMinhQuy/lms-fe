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

// ĐỊNH NGHĨA URL WEBHOOK CHÍNH XÁC
// Ưu tiên biến môi trường, nếu không có thì dùng link cứng bạn đã cung cấp
const CHAT_WEBHOOK_URL = process.env.NEXT_PUBLIC_CHATBOT_URL || "https://verna-piney-linette.ngrok-free.dev/webhook/chatbot";

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
    
    // Lấy thông tin user từ Redux
    const { user } = useSelector((state: any) => state.auth);
    const userId = user?._id;

    // Tự động cuộn xuống cuối khi có tin nhắn mới
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

        // 1. Hiển thị tin nhắn người dùng ngay lập tức
        const userMsg: Message = {
            text: userMessage,
            senderId: userId,
            senderName: user?.name || "User",
            createdAt: new Date(),
            isOwn: true,
        };
        setMessages((prev) => [...prev, userMsg]);

        try {
            // 2. Gọi API n8n Webhook
            // Lưu ý: Dùng trực tiếp CHAT_WEBHOOK_URL, không ghép thêm string để tránh lỗi 404
            const response = await axios.post(
                CHAT_WEBHOOK_URL,
                {
                    chatInput: userMessage, // Key này phải khớp với node Webhook trong n8n
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        // --- QUAN TRỌNG: Dòng này giúp vượt qua màn hình cảnh báo của Ngrok ---
                        "ngrok-skip-browser-warning": "true",
                    },
                    timeout: 30000, // Timeout 30s
                }
            );

            // 3. Xử lý phản hồi từ AI
            // Lưu ý: Node 'Respond to Webhook' trong n8n phải trả về JSON: { "reply": "Nội dung..." }
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
                console.warn("Response format warning:", response.data);
                throw new Error("Invalid response format form n8n");
            }
        } catch (error: any) {
            console.error("[CHAT] Error calling chatbot API:", error);
            
            // Hiển thị tin nhắn lỗi
            const errorMessage: Message = {
                text: t("chat-error") || "Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau.",
                senderId: "ai-assistant",
                senderName: "System",
                createdAt: new Date(),
                isOwn: false,
            };
            setMessages((prev) => [...prev, errorMessage]);
            
            toast.error(t("chat-api-error") || "Không thể kết nối tới AI Server.");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    // Nếu chưa đăng nhập thì không hiện Chatbox
    if (!userId) {
        return null; 
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
                                        className={`max-w-[85%] rounded-lg p-3 shadow-sm ${
                                            message.isOwn
                                                ? "bg-[#37a39a] text-white"
                                                : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        }`}
                                    >
                                        {!message.isOwn && (
                                            <div className="flex items-center gap-1 mb-1 border-b border-gray-200 dark:border-gray-600 pb-1">
                                                <RiRobot2Line size={14} className="text-yellow-500" />
                                                <p className="text-xs font-semibold opacity-75">
                                                    {message.senderName || "AI Assistant"}
                                                </p>
                                            </div>
                                        )}
                                        
                                        {/* Render Markdown Content */}
                                        <div className={`text-sm break-words markdown-content ${message.isOwn ? "[&_*]:text-white" : ""}`}>
                                            {!message.isOwn ? (
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        // Tùy chỉnh CSS cho Markdown
                                                        p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                                                        strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                                                        ul: ({ children }) => <ul className="list-disc list-inside mb-2 pl-1">{children}</ul>,
                                                        ol: ({ children }) => <ol className="list-decimal list-inside mb-2 pl-1">{children}</ol>,
                                                        li: ({ children }) => <li className="mb-1">{children}</li>,
                                                        h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                                                        h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                                                        h3: ({ children }) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
                                                        code: ({ children }) => <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-xs font-mono text-red-500">{children}</code>,
                                                        pre: ({ children }) => <pre className="bg-gray-800 text-white p-2 rounded-md text-xs overflow-x-auto mb-2 mt-1">{children}</pre>,
                                                        a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{children}</a>
                                                    }}
                                                >
                                                    {message.text}
                                                </ReactMarkdown>
                                            ) : (
                                                <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
                                            )}
                                        </div>

                                        {message.createdAt && (
                                            <p className={`text-[10px] mt-1 text-right ${message.isOwn ? "text-gray-100" : "text-gray-400"}`}>
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
                    <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-lg">
                        <div className="flex gap-2 items-end">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder={t("type-message") || "Nhập tin nhắn..."}
                                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37a39a] bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                                disabled={isLoading}
                                autoFocus
                            />
                            <button
                                type="submit"
                                disabled={!inputMessage.trim() || isLoading}
                                className="p-3 bg-[#37a39a] text-white rounded-xl hover:bg-[#2d8a82] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <span className="font-semibold text-sm">{t("send") || "Gửi"}</span>
                                )}
                            </button>
                        </div>
                        {isLoading && (
                            <p className="text-xs text-[#37a39a] mt-2 flex items-center gap-1 animate-pulse px-1">
                                <RiRobot2Line size={12} />
                                {t("ai-thinking") || "AI đang soạn tin nhắn..."}
                            </p>
                        )}
                    </form>
                </div>
            )}
        </>
    );
};

export default ChatBox;