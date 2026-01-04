/**
 * Helper function to get the WebSocket URL from environment variables
 * Converts HTTP/HTTPS URLs to WS/WSS automatically
 */
export const getSocketUrl = (): string => {
    const serverUri = process.env.NEXT_PUBLIC_SERVER_URI || process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8000";
    
    // If NEXT_PUBLIC_SOCKET_URL is explicitly set, use it
    if (process.env.NEXT_PUBLIC_SOCKET_URL) {
        return process.env.NEXT_PUBLIC_SOCKET_URL;
    }
    
    // Otherwise, convert HTTP/HTTPS to WS/WSS
    if (serverUri.startsWith("https://")) {
        return serverUri.replace("https://", "wss://");
    } else if (serverUri.startsWith("http://")) {
        return serverUri.replace("http://", "ws://");
    }
    
    // If it already starts with ws:// or wss://, return as is
    return serverUri;
};

/**
 * Get the API endpoint URL
 */
export const getApiUrl = (): string => {
    return process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:8000";
};

