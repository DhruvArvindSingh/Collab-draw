import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = "secret";
export default function verify(req, res, next) {
    // console.log("req.cookies", req.cookies);
    console.log("req.cookies", req.cookies);
    // console.log("req", req);
    const token = req.cookies.token;
    console.log("req.cookies = ", req.cookies);
    console.log("token = ", token);
    if (token) {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log("err = ", err);
                res.status(401).json({ message: "Unauthorized" });
            }
            else {
                req.body.userId = decoded.userId;
                next();
            }
        });
    }
    else {
        res.status(401).json({ message: "Unauthorized" });
    }
}
