// "use client";
import { useState } from "react";


interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
    type: "rect";
}
interface Circle {
    type: "circle"
    x: number;
    y: number;
    radius: number;
}
type Shape = any;
let Shape: Shape[] = [];
export default function Draw(canvas: HTMLCanvasElement, f_width: number, f_height: number, shape: string, room_id: string, socket: WebSocket, ExistingShape: any) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (Array.isArray(ExistingShape)) {
        ExistingShape.map((item: any) => {
            console.log("item", item);
        });
    } else {
        console.log("ExistingShape:", ExistingShape);
    }
    let clicked = false;
    let startX = 0;
    let startY = 0;
    let width = 0;
    let height = 0;

    // Define event handlers
    const handleMouseDown = (e: MouseEvent) => {
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (clicked) {
            width = e.clientX - startX;
            height = e.clientY - startY;
            drawShape(Shape, ctx, canvas);
            if (shape === "rect") {
                ctx.strokeStyle = "white";
                ctx.strokeRect(startX, startY, width, height);
            }
            else if (shape === "circle") {
                ctx.strokeStyle = "white";
                ctx.beginPath();
                ctx.arc(startX, startY, Math.sqrt(width * width + height * height), 0, 2 * Math.PI);
                ctx.stroke();
            }
        }
    };

    const handleMouseUp = (e: MouseEvent) => {
        clicked = false;
        if (shape === "rect") {
            Shape.push({ x: startX, y: startY, width: width, height: height, type: "rect" });
            socket.send(JSON.stringify({
                type: "update_shape",
                room_id: room_id,
                shape: `{ x: ${startX}, y: ${startY}, width: ${width}, height: ${height}, type: "rect" }`
            }));

        } else if (shape === "circle") {
            Shape.push({ x: startX, y: startY, radius: Math.sqrt(width * width + height * height), type: "circle" });
            socket.send(JSON.stringify({
                type: "update_shape",
                room_id: room_id,
                shape: `{ x: ${startX}, y: ${startY}, radius: ${Math.sqrt(width * width + height * height)}, type: "circle" }`
            }));
        }

    };

    // Clean up previous listeners and add new ones
    canvas.removeEventListener("mousedown", handleMouseDown);
    canvas.removeEventListener("mousemove", handleMouseMove);
    canvas.removeEventListener("mouseup", handleMouseUp);

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    // Initial setup
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawShape(Shape, ctx, canvas);

    // Return cleanup function
    return () => {
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseup", handleMouseUp);
    };
}

function drawShape(Shape: Shape[], ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    console.log("Shape", Shape);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    Shape.map((item) => {
        if (item.type === "rect") {
            ctx.strokeStyle = "white";
            ctx.strokeRect(item.x, item.y, item.width, item.height);
        } else if (item.type === "circle") {
            ctx.strokeStyle = "white";
            ctx.beginPath();
            ctx.arc(item.x, item.y, item.radius, 0, 2 * Math.PI);
            ctx.stroke();
        }
    });
}

function getExistingShapes(room_id: string) {
    // console.log("room_id", room_id);

}
