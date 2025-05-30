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
    const [color, setColor] = useState("white");
    const [lineWidth, setLineWidth] = useState(3);
    const [radius, setRadius] = useState(5);
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
                        backgroundColor: shape === "select" ? '#4CAF50' : '#555',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                    }}
                    onClick={() => (shape !== "select")? setShape("select"): setShape("null")}
                >
                    Select
                </button>
                <button
                    style={{
                        padding: '8px 16px',
                        margin: '0 5px',
                        border: 'none',
                        borderRadius: '20px',
                        backgroundColor: shape === "doodle" ? '#4CAF50' : '#555',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                    }}
                    onClick={() => (shape !== "doodle")? setShape("doodle"): setShape("null")}
                >
                    Doodle
                </button>
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
            <div style={{
                position: 'fixed',
                top: '20px',
                left: '20px',
                backgroundColor: '#333',
                padding: '10px 10px',
                borderRadius: '30px',
                boxShadow: '0 2px 10px rgba(29, 29, 29, 0.2)',
                zIndex: 1000
            }}>
                <button
                    style={{
                        padding: '4px 8px',
                        marginBottom:'7px',
                        border: color === '#FFFFFF' ? '4px solid black' : 'none',
                        borderRadius: '50%',
                        width: '25px',
                        height: '25px',
                        backgroundColor: '#FFFFFF',
                        color: '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onClick={() => setColor('#FFFFFF')}
                >
                    ●
                </button>
                <button
                    style={{
                        padding: '4px 8px',
                        marginBottom:'7px',
                        border: color === '#4CAF50' ? '4px solid black' : 'none',
                        borderRadius: '50%',
                        width: '25px',
                        height: '25px',
                        backgroundColor: '#4CAF50',
                        color: '#4CAF50',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onClick={() => setColor('#4CAF50')}
                >
                    ●
                </button>
                <button
                    style={{
                        border: color === '#0000FF' ? '4px solid black' : 'none',
                        marginBottom:'7px',
                        borderRadius: '50%',
                        width: '25px',
                        height: '25px',
                        backgroundColor: '#0000FF',
                        color: '#0000FF',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onClick={() => setColor('#0000FF')}
                >
                    ●
                </button>
                <button
                    style={{
                        border: color === '#800080' ? '4px solid black' : 'none',
                        marginBottom:'7px',
                        borderRadius: '50%',
                        width: '25px',
                        height: '25px',
                        backgroundColor: '#800080',
                        color: '#800080',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onClick={() => setColor('#800080')}
                >
                    ●
                </button>
                <button
                    style={{
                        border: color === '#FF0000' ? '4px solid black' : 'none',
                        marginBottom:'7px',
                        borderRadius: '50%',
                        width: '25px',
                        height: '25px',
                        backgroundColor: '#FF0000',
                        color: '#FF0000',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onClick={() => setColor('#FF0000')}
                >
                    ●
                </button>
                <button
                    style={{
                        border: color === '#8B00FF' ? '4px solid black' : 'none',
                        marginBottom:'7px',
                        borderRadius: '50%',
                        width: '25px',
                        height: '25px',
                        backgroundColor: '#8B00FF',
                        color: '#8B00FF',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onClick={() => setColor('#8B00FF')}
                >
                    ●
                </button>
                <button
                    style={{
                        border: color === '#4B0082' ? '4px solid black' : 'none',
                        marginBottom:'7px',
                        borderRadius: '50%',
                        width: '25px',
                        height: '25px',
                        backgroundColor: '#4B0082',
                        color: '#4B0082',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onClick={() => setColor('#4B0082')}
                >
                    ●
                </button>
                <button
                    style={{
                        border: color === '#FFFF00' ? '4px solid black' : 'none',
                        marginBottom:'7px',
                        borderRadius: '50%',
                        width: '25px',
                        height: '25px',
                        backgroundColor: '#FFFF00',
                        color: '#FFFF00',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onClick={() => setColor('#FFFF00')}
                >
                    ●
                </button>
            </div>
            <div style={{
                fontFamily: 'Arial, sans-serif',
                position: 'fixed',
                bottom: '200px',
                left: '20px',
                backgroundColor: '#333',
                padding: '10px 10px',
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(29, 29, 29, 0.2)',
                zIndex: 1000
            }}>
                <div style={{
                    color: 'white',
                    marginBottom: '2px',
                    fontSize: '14px'
                }}>
                    Line Width: {lineWidth}
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        step="0.5"
                        value={lineWidth}
                        onChange={(e) => setLineWidth(parseFloat(e.target.value))}
                        style={{
                            width: '100px',
                            accentColor: '#555'
                        }}
                    />
                    
                </div>
                <div style={{
                    color: 'white',
                    marginBottom: '2px',
                    fontSize: '14px'
                }}>
                    Border Radius: {radius}
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={radius}
                        onChange={(e) => setRadius(parseFloat(e.target.value))}
                        style={{
                            width: '100px',
                            accentColor: '#555'
                        }}
                    />
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '10px',
                    gap: '10px'
                }}>
                    <button
                        style={{
                            backgroundColor: '#555',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 12px',
                            cursor: 'pointer',
                            flex: 1
                        }}
                        id="clear-btn"
                    >
                        <svg width="20" height="20" viewBox="0 0 25 25" fill="currentColor">
                            <path d="M5 13h14v-2H5v2zm-2 4h14v-2H3v2zM7 7v2h14V7H7z"/>
                        </svg>
                    </button>
                    <button
                        style={{
                            backgroundColor: '#555',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 12px',
                            cursor: 'pointer',
                            flex: 1
                        }}
                        id="undo-btn"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/>
                        </svg>
                    </button>
                    <button
                        style={{
                            backgroundColor: '#d32f2f',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 12px',
                            cursor: 'pointer',
                            flex: 1
                        }}
                        id="delete-btn"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                    </button>
                </div>
            </div>
            <MainCanvas socket={socket} S_shape={shape} room_id={room_id} color={color} lineWidth={lineWidth} radius={radius} />

        </div>
    )

}
