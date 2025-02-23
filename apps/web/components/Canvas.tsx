"use client";
import { useState, useEffect } from "react";
import { WS_URL } from "../config/index";
import Cookies from "js-cookie";
import MainCanvas from "./mainCanvas";
export default function Canvas({
    room_id
}: {
    room_id: string
}) {
    const [shape, setShape] = useState("null");
    const [socket, setSocket] = useState<WebSocket | null>(null);
    useEffect(() => {
        const socket = new WebSocket(`${WS_URL}?token=${Cookies.get("token")}`);
        socket.onopen = () => {
            setSocket(socket);
            console.log("Connected to server");
            socket.send(JSON.stringify({
                type: "join_room",
                room_id: room_id
            }));  
        };
    }, []);
    

    if (socket === null) {
        return (
            <div>
                <h1>Connecting to server...</h1>
            </div>
        )
    }
    return (
        <div>
            <nav style={{
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#333',
                padding: '10px 20px',
                borderRadius: '30px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                zIndex: 1000
            }}>
                <button
                    style={{
                        padding: '8px 16px',
                        margin: '0 5px',
                        border: 'none',
                        borderRadius: '20px',
                        backgroundColor: shape === "rect" ? '#4CAF50' : '#555',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                    }}
                    onClick={() => (shape !== "rect")? setShape("rect"): setShape("null")}
                >
                    Rectangle
                </button>
                <button
                    style={{
                        padding: '8px 16px',
                        margin: '0 5px',
                        border: 'none',
                        borderRadius: '20px',
                        backgroundColor: shape === "circle" ? '#4CAF50' : '#555',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                    }}
                    onClick={() => (shape !== "circle")? setShape("circle"): setShape("null")}
                >
                    Circle
                </button>
                <button
                    style={{
                        padding: '8px 16px',
                        margin: '0 5px',
                        border: 'none',
                        borderRadius: '20px',
                        backgroundColor: shape === "line" ? '#4CAF50' : '#555',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                    }}
                    onClick={() => (shape !== "line")? setShape("line"): setShape("null")}
                >
                    Line
                </button>
                <button
                    style={{
                        padding: '8px 16px',
                        margin: '0 5px',
                        border: 'none',
                        borderRadius: '20px',
                        backgroundColor: shape === "text" ? '#4CAF50' : '#555',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                    }}
                    onClick={() => (shape !== "text")? setShape("text"): setShape("null")}
                >
                    Text
                </button>
            </nav>
            <MainCanvas socket={socket} S_shape={shape} room_id={room_id} />

        </div>
    )

}
