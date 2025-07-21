import initializeSocket from "@/config/initializeSocket";
import { useEffect, useRef, useState } from "react";

export const useSocket = () => {
  const [socketInstance, setSocketInstance] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket only once
    if (!socketRef.current) {
      socketRef.current = initializeSocket();
      setSocketInstance(socketRef.current);

      // Listen for connection status changes
      socketRef.current.on("connect", () => {
        setIsConnected(true);
      });

      socketRef.current.on("disconnect", () => {
        setIsConnected(false);
      });
    }

    // Cleanup function - but don't disconnect immediately
    return () => {
      // Don't disconnect here as other components might be using the socket
      // Socket will be cleaned up when the app unmounts or page refreshes
    };
  }, []);

  // Cleanup socket when component unmounts (app level)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socket = null;
        socketRef.current = null;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    
    return () => {
      window.addEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return { 
    socket: socketInstance, 
    isConnected,
    // Helper methods
    emit: (event, data) => socketInstance?.emit(event, data),
    on: (event, callback) => socketInstance?.on(event, callback),
    off: (event, callback) => socketInstance?.off(event, callback),
  };
};