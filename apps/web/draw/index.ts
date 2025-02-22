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
export default function Draw(canvas: HTMLCanvasElement, f_width: number, f_height: number, shape: string, room_id: string, socket: WebSocket) {
    const ctx = canvas.getContext("2d");
    let clicked = false;
    console.log("Shape", Shape);
    let startX = 0;
    let startY = 0;
    let width = 0;
    let height = 0;
    if (!ctx) return;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // getExistingShapes(room_id);


    canvas.addEventListener("mousedown", (e) => {
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
        // console.log(shape);
        // console.log(`mousedown at ${e.clientX}x${e.clientY}`);
        // ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
            // console.log(`mousemove at ${e.clientX}x${e.clientY}`);
            width = e.clientX - startX;
            height = e.clientY - startY;
            drawShape(Shape, ctx, canvas);
            getExistingShapes(room_id);
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
    });
    canvas.addEventListener("mouseup", (e) => {
        clicked = false;
        // console.log(`mouseup at ${e.clientX}x${e.clientY}`);
        if (shape === "rect") {
            console.log("shape: ", shape);
            console.log("rect: ", startX, startY, width, height);
            Shape.push({ x: startX, y: startY, width: width, height: height, type: "rect" });
            return;
        } else if (shape === "circle") {
            console.log("shape: ", shape);
            console.log("circle: ", startX, startY, Math.sqrt(width * width + height * height));
            Shape.push({ x: startX, y: startY, radius: Math.sqrt(width * width + height * height), type: "circle" });
            return;
        }
    });

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
