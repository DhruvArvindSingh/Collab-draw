import { client } from "@repo/db/client";
export default async function get_shapes(req, res) {
    const { room_id } = req.params;
    if (!room_id) {
        res.status(400).json({ message: "Room ID is required" });
        return;
    }
    const shapes = await client.shape.findMany({
        where: {
            roomID: parseInt(room_id)
        },
        include: {
            user: true,
        },
        orderBy: {
            id: "desc"
        },
        take: 10000
    });
    res.status(200).json({ shapes });
}
