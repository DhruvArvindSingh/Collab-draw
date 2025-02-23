import { useRef, useEffect, useState } from "react";
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
    const [Shape, setShape] = useState<any[]>([]);
    const [shapesFetched, setShapesFetched] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!shapesFetched) {
            const fetchShapes = async () => {
                const shapes = await getExistingShapes(room_id);
                setShape(shapes);
                setShapesFetched(true);
            };
            fetchShapes();
        }
    }, [shapesFetched, room_id]);

    useEffect(() => {
        if (canvasRef.current && shapesFetched) {
            const canvas = canvasRef.current;
            Draw(canvas, 2000, 2000, shape, room_id, socket, Shape);
        }
        return () => {
            setShape([]);
        }
    }, [canvasRef, shape]);

    return (
        <canvas ref={canvasRef} width={2000} height={2000}></canvas>
    )
}



