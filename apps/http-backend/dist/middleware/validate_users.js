import get_user from "../database/utils/get_user.js";
export default async function validate_users(req, res, next) {
    console.log("validate_users called");
    console.log("req.body =", req.body);
    const user = await get_user(req.body.username, "username");
    const email = await get_user(req.body.email, "email");
    // console.log("user =", user);
    // console.log("email =", email);
    if (user === null && email === null) {
        next();
    }
    else {
        console.log("user.rows.length =", user);
        console.log("email.rows.length =", email);
        if (user !== null) {
            console.log("Username already exists");
            res.status(401).json({ message: "Username already exists" });
        }
        else {
            console.log("Email already exists");
            res.status(401).json({ message: "Email already exists" });
        }
    }
}
