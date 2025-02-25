import { client } from "@repo/db/client";

export default async function createShape(shape: any, room_id: string, user_id: number) {
    const res = await client.shape.create({
        data: {
            shape: `${shape}`,
            roomID: parseInt(room_id),
            userID: user_id
        }
    });
    return res;
}
