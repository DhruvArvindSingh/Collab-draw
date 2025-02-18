import client from "../index.js";

export default async function insert_user(username: string, email: string, password: string) {
    const user = await client.query(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
        [username, email, password]
    );
    return user;
}   
