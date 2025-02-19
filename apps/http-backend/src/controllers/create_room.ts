import { Request, Response } from "express";
import { client} from "@repo/db/client";
export default async function create_room(req: Request, res: Response) {
    console.log("create_room called");
    console.log("req.body =", req.body);
    try {
        const name = req.body.name;
        console.log("name =", name);
        // @ts-ignore
        const user = req.body.userId;
        try{
            const room = await client.room.create({
                data: {
                    name: name,
                    adminID: user
                }
            });
            res.status(200).json({ roomId: room.id });
        } catch (error) {
            console.log("error =", error);
            res.status(411).json({ message: "Room already exists" });
        }


    } catch (error) {
        console.log("error =", error);
        res.status(500).json({ message: "Room creation failed" });
    }
}

