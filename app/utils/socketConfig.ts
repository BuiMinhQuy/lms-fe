/**
 * Helper function to get the Socket.IO server URL from environment variables
 * Socket.IO server typically runs at root path, not at /api/v1
 * So we need to extract the base URL (without API paths)
 */
export const getSocketUrl = (): string => {
    let url: string;
    
    // If NEXT_PUBLIC_SOCKET_URL is explicitly set, use it
    if (process.env.NEXT_PUBLIC_SOCKET_URL) {
        url = process.env.NEXT_PUBLIC_SOCKET_URL;
    } else {
        // Otherwise, use SERVER_URI
        url = process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:8000";
    }
    
    // Remove trailing slash if present
    url = url.replace(/\/$/, "");
    
    // Socket.IO server typically runs at root path, not at /api/v1
    // Extract base URL by removing common API paths
    // For example: https://domain.com/api/v1 -> https://domain.com
    const apiPathPatterns = [
        /\/api\/v\d+$/i,  // /api/v1, /api/v2, etc.
        /\/api$/i,        // /api
    ];
    
    for (const pattern of apiPathPatterns) {
        if (pattern.test(url)) {
            url = url.replace(pattern, "");
            console.log(`[SOCKET] Removed API path from URL, using base: ${url}`);
            break;
        }
    }
    
    // Socket.IO client works with HTTP/HTTPS URLs directly
    // It will automatically use WebSocket or polling transport
    console.log(`[SOCKET] Socket URL: ${url}`);
    return url;
};

/**
 * Get the API endpoint URL
 */
export const getApiUrl = (): string => {
    return process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:8000";
};

