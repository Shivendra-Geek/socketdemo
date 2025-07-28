"use client";

import { useSocket } from '@/hooks/useSocket';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function Page() {

  const { socket } = useSocket();
  const { admin } = useParams();
  const [onlinePlayers, setOnlinePlayers] = useState([]);

  useEffect(() => {
    if(!socket) return;
    
    socket.emit("shop-connect", admin);

    const handleOnlineUsers = (players) => {
        console.log("Online players:", players);
        setOnlinePlayers(players);
    };

    socket.on("online-users", handleOnlineUsers);

    return () => {
        socket.off("online-users", handleOnlineUsers);
    };
  }, [socket, admin]); // Added admin to dependencies

    

  return (
    <div>
        <h1>Admin Room: {admin}</h1>
        <ul className='flex flex-col gap-2 text-center text-2xl' >
            { onlinePlayers?.map((player, index) => (
                <li key={index}>{player}</li>
            ))}
        </ul>
    </div>
  )
}

export default Page