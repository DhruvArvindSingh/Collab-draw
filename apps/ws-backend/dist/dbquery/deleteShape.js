import { client } from "@repo/db/client";
export default async function deleteShape(id) {
    console.log("Deleting shape", id);
    const res = await client.shape.delete({
        where: {
            id: id
        }
    });
    return res;
}
