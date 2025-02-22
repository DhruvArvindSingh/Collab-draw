import { client } from "@repo/db/client";
import { Request, Response } from "express";


export default async function get_shapes(req: Request, res: Response){
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
        take:50
    });
    res.status(200).json({ shapes });
}
