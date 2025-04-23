'use client';

import Canvas from "../../../components/Canvas";

export default function CanvasPage({
    params: { room_id }
}: {
    params: { room_id: string }
}) {
    console.log("room_id", room_id);
    return <Canvas room_id={room_id} />;
}