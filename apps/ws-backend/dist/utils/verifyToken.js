import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
// const { JWT_SECRET } = process.env;
const JWT_SECRET = "secret";
export default function verify_token(token) {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("decoded =", decoded);
    if (typeof decoded === "string") {
        return null;
    }
    if (!decoded || !decoded.userId) {
        return null;
    }
    return decoded.userId;
}
