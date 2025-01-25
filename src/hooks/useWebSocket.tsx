import { useEffect, useState } from "react";

const useWebSocket = (userLogin: string) => {
  const [status, setStatus] = useState<string>("loading");
  const [streamData, setStreamData] = useState<any>(null);

  useEffect(() => {
    const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
    const socket = new WebSocket(`${wsProtocol}://${window.location.hostname}/ws/${userLogin}`);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStatus(data.status);
      setStreamData(data.data);
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      socket.close();
    };
  }, [userLogin]);

  return { status, streamData };
};

export default useWebSocket; // Hook wird hier exportiert
