"use client";
import { useEffect, useRef } from "react";
// import "../../globals.css"

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            
            let clicked = false;
            let startX = 0;
            let startY = 0;
            let width = 0;
            let height = 0;
            
            canvas.addEventListener("mousedown", (e) => {
                clicked = true;
                startX = e.clientX;
                startY = e.clientY;
                console.log(`mousedown at ${e.clientX}x${e.clientY}`);
                // ctx.fillRect(0, 0, canvas.width, canvas.height);
            });
            canvas.addEventListener("mousemove", (e) => {
                if (clicked) {
                    console.log(`mousemove at ${e.clientX}x${e.clientY}`);
                    width = e.clientX - startX;
                    height = e.clientY - startY;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = "black";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.strokeStyle = "white";
                    ctx.strokeRect(startX, startY, width, height);
                }
            });
            canvas.addEventListener("mouseup", (e) => {

                clicked = false;
                console.log(`mouseup at ${e.clientX}x${e.clientY}`);
            });
            // ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }, [canvasRef]);
    return (
        <div>
            <canvas ref={canvasRef} width={2000} height={2000}></canvas>
        </div>
    )
}