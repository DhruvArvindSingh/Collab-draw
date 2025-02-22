import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
dotenv.config();

const { JWT_SECRET } = process.env;
export default function verify(req: Request, res: Response, next: NextFunction) {
    // console.log("req.cookies", req.cookies);
    // console.log("req.cookies", req.cookie);
    // console.log("req", req);
    const token = req.cookies.token;
    console.log("token = ", token);
    if (token) {
        jwt.verify(token, JWT_SECRET as string, (err: any, decoded: any) => {
            if (err) {
                res.status(401).json({ message: "Unauthorized" });
            } else {
                req.body.userId = decoded.userId;
                next();
            }
        });
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
}
