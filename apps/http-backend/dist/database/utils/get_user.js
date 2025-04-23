import { client } from "@repo/db/client";
export default async function get_user(email, value) {
    console.log("get_user called");
    console.log("decoded email = ", email);
    let object = { email: '' };
    if (value === "email") {
        object = {
            email: email
        };
    }
    else if (value === "username") {
        object = {
            username: email
        };
    }
    else {
        return null;
    }
    return await client.user.findUnique({
        where: object
    });
}
