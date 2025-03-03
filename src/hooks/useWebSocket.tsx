import { useEffect, useState, useRef } from "react";

const useWebSocket = (userLogin: string) => {
  const [status, setStatus] = useState<string>("loading");
  const [streamData, setStreamData] = useState<any>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef<number>(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    // Function to connect WebSocket
    const connectWebSocket = () => {
      // Close existing connection if any
      if (socketRef.current && socketRef.current.readyState < 2) {
        socketRef.current.close();
      }

      const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
      const socket = new WebSocket(
        `${wsProtocol}://${window.location.hostname}/ws/${userLogin}`
      );
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("WebSocket connected");
        reconnectAttemptsRef.current = 0; // Reset reconnect counter on successful connection
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // Handle heartbeat messages separately
          if (data.status === "heartbeat") {
            console.log("Received heartbeat");
            return;
          }

          setStatus(data.status);
          setStreamData(data.data);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      socket.onclose = (event) => {
        console.log(`WebSocket closed with code ${event.code}`);

        // Don't reconnect if this was a clean close or max attempts reached
        if (
          event.wasClean ||
          reconnectAttemptsRef.current >= maxReconnectAttempts
        ) {
          if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
            console.log("Max reconnection attempts reached");
            setStatus("offline"); // Fallback to offline state
          }
          return;
        }

        // Exponential backoff for reconnection attempts
        const delay = Math.min(1000 * 2 ** reconnectAttemptsRef.current, 30000);
        console.log(`Reconnecting in ${delay}ms...`);

        reconnectAttemptsRef.current += 1;
        reconnectTimeoutRef.current = window.setTimeout(
          connectWebSocket,
          delay
        );
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        // Let onclose handle reconnection
      };
    };

    // Initial connection
    connectWebSocket();

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (reconnectTimeoutRef.current !== null) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [userLogin]);

  return { status, streamData };
};

export default useWebSocket;
