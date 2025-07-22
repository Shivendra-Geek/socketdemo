"use client";

import JoinRoom from "@/components/JoinRoom";
import { useSocket } from "@/hooks/useSocket";
import { useCallback, useEffect, useState } from "react";

export default function Page() {
  const { socket, isConnected } = useSocket();
  const [alerts, setAlerts] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");

  // Memoize the alert handler to prevent unnecessary re-renders
  const handleAlert = useCallback((alert) => {
    console.log("Alert received:", alert);
    setAlerts((prev) => [...prev, {
      id: Date.now() + Math.random(), // Unique ID for each alert
      message: alert,
      timestamp: new Date().toLocaleTimeString()
    }]);
  }, []);

  // Handle connection status updates
  useEffect(() => {
    if (isConnected) {
      setConnectionStatus("Connected");
    } else {
      setConnectionStatus("Disconnected");
    }
  }, [isConnected]);

  useEffect(() => {
    if (!socket) {
      setConnectionStatus("Socket not initialized");
      return;
    }

    console.log("Setting up alert listener");

    // Listen for alerts
    // socket.on("alert", handleAlert);

    // socket.emit("join-room", "GeekSuperAdmin_1751523082582_super-administrator");
    socket.on("alert", handleAlert);



    // Optional: Listen for other events
    socket.on("notification", (data) => {
      console.log("Notification received:", data);
    });

    // Cleanup function - only remove the specific listeners
    return () => {
      console.log("Cleaning up alert listener");
      socket.off("alert", handleAlert);
      socket.off("notification");
    };
  }, [socket, handleAlert]);

  // Test function to trigger an alert from the frontend
  const triggerTestAlert = () => {
    if (socket) {
      socket.emit("test-alert", { 
        message: "Test alert from frontend",
        timestamp: new Date().toISOString()
      });
    }
  };

  // Clear all alerts
  const clearAlerts = () => {
    setAlerts([]);
  };

  return (
    <div className="flex flex-row grid-rows-1 min-h-screen">
     <JoinRoom/>
     <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold">ALERTS DEMO!</h1>
        <div className="mt-2 flex items-center justify-center gap-2">
          <span className="text-sm">Status:</span>
          <span className={`px-2 py-1 rounded text-sm ${
            isConnected 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {connectionStatus}
          </span>
          {socket && (
            <span className="text-xs text-gray-500">
              ID: {socket.id || 'Not connected'}
            </span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-2xl">
        {/* Controls */}
        <div className="mb-4 flex gap-2 justify-center">
          <button
            onClick={triggerTestAlert}
            disabled={!isConnected}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Send Test Alert
          </button>
          <button
            onClick={clearAlerts}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Clear Alerts
          </button>
        </div>

        {/* Alerts Container */}
        <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No alerts yet. {isConnected ? "Waiting for alerts..." : "Connect to start receiving alerts."}
            </div>
          ) : (
            alerts.map((alert) => (
              <div 
                key={alert.id} 
                className="bg-gray-100 p-3 rounded-md text-black border-l-4 border-blue-500 animate-fadeIn"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium">
                      {typeof alert.message === 'string' 
                        ? alert.message 
                        : JSON.stringify(alert.message)
                      }
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {alert.timestamp}
                    </div>
                  </div>
                  <button
                    onClick={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))}
                    className="text-gray-400 hover:text-gray-600 text-sm ml-2"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Alert Count */}
        {alerts.length > 0 && (
          <div className="text-center text-sm text-gray-600 mt-4">
            Total alerts: {alerts.length}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-xs text-gray-500 text-center">
        Socket.io Integration Demo
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
     </div>
    </div>
  );
}