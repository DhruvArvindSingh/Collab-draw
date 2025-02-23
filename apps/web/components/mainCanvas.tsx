import { useRef, useEffect, useState } from "react";
import { useWindowSize } from "@uidotdev/usehooks";
import Game from "../draw/Game";

export default function mainCanvas({
    S_shape,
    socket,
    room_id,
    color
}: {
    S_shape: string,
    socket: WebSocket,
    room_id: string,
    color: string
}) {
    const [game, setGame] = useState<Game | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const size = useWindowSize();

    useEffect(() => {
        game?.setShape(S_shape);
    }, [game, S_shape]);
    useEffect(() => {
        game?.setColor(color);
    }, [game, color]);

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const g = new Game(canvas, S_shape, room_id, socket, color);
            setGame(g);
            return () => {
                g.destroy();
            }
        }

    }, [canvasRef]);

    return (
        <canvas ref={canvasRef} width={size.width ?? 0} height={size.height ?? 0}></canvas>
    )
}



