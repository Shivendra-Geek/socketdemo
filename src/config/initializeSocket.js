import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

// Single socket instance to prevent multiple connections
let socket = null;

const initializeSocket = () => {
  if (!socket) {
    // Use http:// instead of ws:// for socket.io 
    socket = io("http://localhost:1337/", {
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      withCredentials: true, // Add this if you need credentials
    });
    
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });
    
    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log("🔄 Socket reconnected after", attemptNumber, "attempts");
    });
  }
  return socket;
};

export default initializeSocket;