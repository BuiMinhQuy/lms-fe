import { io, Socket } from "socket.io-client";
import { getSocketUrl } from "./socketConfig";

const socketUrl = getSocketUrl();
console.log(`[SOCKET] Initializing socket connection to: ${socketUrl}`);

const socket = io(socketUrl, {
    transports: ["websocket", "polling"], // Allow both, let Socket.IO choose
    autoConnect: false,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity,
    timeout: 20000,
});

// Track current userId to rejoin on reconnect
let currentUserId: string | null = null;
let isJoiningRoom = false;
let joinTimeout: NodeJS.Timeout | null = null;

// Helper function to join user room
export const joinUserRoom = (userId: string) => {
    if (!userId) {
        console.warn("[SOCKET] Cannot join user room: userId is empty");
        return;
    }

    // If same user and already connected, skip (don't log to reduce noise)
    if (currentUserId === userId && socket.connected) {
        return;
    }

    // If currently joining (and it's been less than 5 seconds), skip
    if (isJoiningRoom && currentUserId === userId) {
        console.log(`[SOCKET] ⏭️ Already joining room for user_${userId}, skipping`);
        return;
    }

    // Clear any existing timeout
    if (joinTimeout) {
        clearTimeout(joinTimeout);
        joinTimeout = null;
    }

    // Store userId for reconnection
    currentUserId = userId;
    isJoiningRoom = true;

    const performJoin = () => {
        socket.emit("joinUserRoom", userId);
        console.log(`[SOCKET] 👤 Emitting joinUserRoom for user_${userId}`);
        
        // Reset joining flag after a short delay
        joinTimeout = setTimeout(() => {
            isJoiningRoom = false;
            joinTimeout = null;
        }, 3000);
    };

    if (socket.connected) {
        performJoin();
    } else {
        // Connect socket if not connected
        console.log(`[SOCKET] 🔌 Connecting socket first...`);
        socket.connect();
        
        // Wait for connection then join
        socket.once("connect", () => {
            console.log(`[SOCKET] ✅ Socket connected, joining user room: user_${userId}`);
            performJoin();
        });
    }
};

// Helper function to setup payment success listener
export const onPaymentSuccess = (callback: (data: any) => void) => {
    socket.on("paymentSuccess", callback);
    
    // Return cleanup function
    return () => {
        socket.off("paymentSuccess", callback);
    };
};

// Helper function to setup notification listener
export const onNewNotification = (callback: (notification: any) => void) => {
    socket.on("newNotification", callback);
    
    // Return cleanup function
    return () => {
        socket.off("newNotification", callback);
    };
};

// Reconnect logic - auto rejoin room on reconnect
socket.on("connect", () => {
    console.log("[SOCKET] ✅ Socket connected");
    
    // Rejoin user room if we have a userId
    if (currentUserId) {
        console.log(`[SOCKET] 🔄 Rejoining user room: user_${currentUserId}`);
        // Reset joining flag to allow rejoin
        isJoiningRoom = false;
        if (joinTimeout) {
            clearTimeout(joinTimeout);
            joinTimeout = null;
        }
        socket.emit("joinUserRoom", currentUserId);
    }
});

socket.on("disconnect", (reason) => {
    console.log(`[SOCKET] ❌ Socket disconnected. Reason: ${reason}`);
});

socket.on("reconnect", (attemptNumber) => {
    console.log(`[SOCKET] 🔄 Socket reconnected after ${attemptNumber} attempts`);
    
    // Rejoin user room on reconnect
    if (currentUserId) {
        console.log(`[SOCKET] 🔄 Rejoining user room after reconnect: user_${currentUserId}`);
        // Reset joining flag to allow rejoin
        isJoiningRoom = false;
        if (joinTimeout) {
            clearTimeout(joinTimeout);
            joinTimeout = null;
        }
        socket.emit("joinUserRoom", currentUserId);
    }
});

socket.on("connect_error", (error) => {
    console.error("[SOCKET] ❌ Connection error:", error.message);
    console.error("[SOCKET] Connection URL:", socketUrl);
    console.error("[SOCKET] Error details:", error);
});

// Helper to get socket connection status
export const getSocketStatus = () => {
    return {
        connected: socket.connected,
        id: socket.id,
        userId: currentUserId,
    };
};

// Helper to disconnect and clear userId
export const leaveUserRoom = () => {
    currentUserId = null;
    if (socket.connected) {
        socket.disconnect();
    }
};

export default socket;
