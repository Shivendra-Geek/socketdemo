"use client"
import { useSocket } from "@/hooks/useSocket";
import { useState } from "react";
import { useRouter } from "next/navigation";






export default function JoinRoom() {
   
  const socket = useSocket();
  const router = useRouter();

  const [roomName, setRoomName] = useState(null);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Join a Room</h2>
        <form className="space-y-4">
          <input
            type="text"
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter Room Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <button
            type="submit"
            onClick={(e)=>{
              e.preventDefault();
              // socket.emit("join-room", roomName);
              router.push(`${window.location.pathname}?role=${roomName.split("-")[0]}`);
              socket.emit("presence:connect",{userId:roomName.split("-")[1], parentId:null, username:roomName.split("-")[2], role:roomName.split("-")[0]});
            }}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
}
