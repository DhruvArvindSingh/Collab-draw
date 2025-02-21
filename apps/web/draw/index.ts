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
export default function Draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, f_width: number, f_height: number, shape: string) {
    let clicked = false;
    let startX = 0;
    let startY = 0;
    let width = 0;
    let height = 0;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let Shape: Shape[] = [];

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
            Shape.push({ x: startX, y: startY, width: width, height: height, type: "rect" });
        } else if (shape === "circle") {
            Shape.push({ x: startX, y: startY, radius: Math.sqrt(width * width + height * height), type: "circle" });
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
