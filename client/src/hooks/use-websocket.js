import { useState, useEffect, useCallback, useRef } from 'react';
export function useWebSocket() {
    const [socket, setSocket] = useState(null);
    const [lastMessage, setLastMessage] = useState(null);
    const [readyState, setReadyState] = useState(3); // WebSocket.CLOSED = 3
    const reconnectTimeoutRef = useRef();
    const connect = useCallback(() => {
        try {
            if (socket?.readyState === 1) { // WebSocket.OPEN = 1
                return;
            }
            const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
            const wsUrl = `${protocol}//${window.location.host}/ws`;
            const ws = new WebSocket(wsUrl);
            ws.onopen = () => {
                console.log('WebSocket connected');
                setReadyState(1); // WebSocket.OPEN
            };
            ws.onmessage = (event) => {
                try {
                    if (event?.data) {
                        const message = JSON.parse(event.data);
                        setLastMessage(message);
                    }
                }
                catch (error) {
                    console.error('Failed to parse WebSocket message:', error);
                }
            };
            ws.onclose = () => {
                console.log('WebSocket disconnected');
                setReadyState(3); // WebSocket.CLOSED
                setSocket(null);
                // Attempt to reconnect after 3 seconds, but only in development
                if (process.env.NODE_ENV === 'development') {
                    reconnectTimeoutRef.current = setTimeout(() => {
                        connect();
                    }, 3000);
                }
            };
            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                setReadyState(3); // WebSocket.CLOSED
            };
            setSocket(ws);
        }
        catch (error) {
            console.error('Failed to create WebSocket connection:', error);
            setReadyState(3); // WebSocket.CLOSED
        }
    }, [socket?.readyState]);
    useEffect(() => {
        // Only attempt WebSocket connection in development
        if (process.env.NODE_ENV === 'development') {
            connect();
        }
        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (socket && socket.readyState === 1) {
                socket.close();
            }
        };
    }, []);
    const sendMessage = useCallback((message) => {
        try {
            if (socket && socket.readyState === 1) { // WebSocket.OPEN
                socket.send(JSON.stringify(message));
            }
        }
        catch (error) {
            console.error('Failed to send WebSocket message:', error);
        }
    }, [socket]);
    return {
        sendMessage,
        lastMessage,
        readyState,
        connect
    };
}
