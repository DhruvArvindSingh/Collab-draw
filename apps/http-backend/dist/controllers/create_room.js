import { client } from "@repo/db/client";
export default async function create_room(req, res) {
    console.log("create_room called");
    console.log("req.body =", req.body);
    try {
        // @ts-ignore
        const user = req.body.userId;
        try {
            const room = await client.room.create({
                data: {
                    adminID: user
                }
            });
            res.status(200).json({ roomId: room.id });
        }
        catch (error) {
            console.log("error =", error);
            res.status(411).json({ message: "Room already exists" });
        }
    }
    catch (error) {
        console.log("error =", error);
        res.status(500).json({ message: "Room creation failed" });
    }
}
