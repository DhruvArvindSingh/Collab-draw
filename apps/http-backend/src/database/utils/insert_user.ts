import { client } from "@repo/db/client";

export default async function insert_user(username: string, email: string, password: string) {
    const user = await client.user.create({
        data: {
            username,
            email,
            password
        }
    });
    return user;
}   
