import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const { JWT_SECRET } = process.env;

export default function verify_token(token: string): string | null {
    const decoded = jwt.verify(token, JWT_SECRET as string);
    console.log("decoded =", decoded);
    if (typeof decoded === "string") {
        return null;
    }
    if (!decoded || !decoded.userId) {
        return null;
    }
    return decoded.userId;
}