"use client"
import { useSocket } from '@/hooks/useSocket';
import React, { useEffect } from 'react'


function page() {
    
    const {socket ,  isConnected} = useSocket();

    useEffect(()=>{
        if(!socket) return;
        socket.emit("join-room", "GeekSuperAdmin_1751523082582_super-administrator");
    },[socket])

    useEffect(()=>{
        if(!socket) return;
        socket.on("alert", (data)=>{
            console.log(data);
        })
    },[socket])

  return (
    <div>
        <h1>Alert Page</h1>
        <p>Is Connected: {isConnected ? "Connected" : "Disconnected"}</p>
    </div>
  )
}

export default page