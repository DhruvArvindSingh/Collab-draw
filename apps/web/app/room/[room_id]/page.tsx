"use client";
import { useEffect, useRef, useState } from "react";
import Draw from "../../../draw/index";

// import "../../globals.css"

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [shape, setShape] = useState("null");
    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            // console.log("shape:", shape);
            Draw(canvas, ctx, 2000, 2000, shape);
            
            // ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }, [canvasRef, shape]);
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
                        backgroundColor: '#555',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                    }}
                    onClick={() => {
                        setShape("rect");
                    }}
                >
                    Rectangle
                </button>
                <button
                    style={{
                        padding: '8px 16px',
                        margin: '0 5px',
                        border: 'none',
                        borderRadius: '20px',
                        backgroundColor: '#555',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                    }}
                    onClick={() => setShape("circle")}
                >
                    Circle
                </button>
                <button
                    style={{
                        padding: '8px 16px',
                        margin: '0 5px',
                        border: 'none',
                        borderRadius: '20px',
                        backgroundColor: '#555',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                    }}
                    onClick={() => setShape("line")}
                >
                    Line
                </button>
            </nav>
            <canvas ref={canvasRef} width={2000} height={2000}></canvas>
        </div>
    )
}