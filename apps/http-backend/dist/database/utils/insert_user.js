import { client } from "@repo/db/client";
export default async function insert_user(username, email, password) {
    const user = await client.user.create({
        data: {
            username,
            email,
            password
        }
    });
    return user;
}
