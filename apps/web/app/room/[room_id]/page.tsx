
import Canvas from "../../../components/Canvas";




// import "../../globals.css"

export default async function CanvasPage({
    params
}: {
    params: {
        room_id: string
    }
}) {
    const { room_id } = await params;
    console.log("room_id", room_id);
    return <Canvas room_id={room_id} />
    
}