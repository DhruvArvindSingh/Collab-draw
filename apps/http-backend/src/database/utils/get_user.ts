import client from "../index.js";
export default async function get_user(email: string, value: string) {
    console.log("get_user called");
    console.log("decoded email = ", email);
    console.log("decoded value = ", value);
    return await client.query(`
        SELECT * FROM users WHERE ${value} = $1;
        `, [email]);

}