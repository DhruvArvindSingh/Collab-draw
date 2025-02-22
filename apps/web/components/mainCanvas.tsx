import { useRef, useEffect } from "react";
import Draw from "../draw/index";
import getExistingShapes from "../draw/getExistingShapes";

export default function mainCanvas({
    shape,
    socket,
    room_id
}: {
    shape: string,
    socket: WebSocket,
    room_id: string
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    let Shape: any;
    Shape = getExistingShapes(room_id);


    useEffect(() => {
        // console.log("if value inside useEffect");
        // console.log("canvasRef.current", canvasRef.current);
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            // console.log("shape:", shape);
            // console.log('canvasRef.current', canvasRef.current);
            Draw(canvas, 2000, 2000, shape, room_id, socket, Shape);
            // ctx.fillRect(0, 0, canvas.width, canvas.he   ight);
        }
        return () => {
            Shape = [];
        }
    }, [canvasRef, shape]);
    return (
        <canvas ref={canvasRef} width={2000} height={2000}></canvas>
    )
}



