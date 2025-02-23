import get_user from "../database/utils/get_user.js";
import { Request, Response, NextFunction } from "express";

export default async function check_email(req: Request, res: Response, next: NextFunction) {
    console.log("check_email middleware called");
    console.log("req.body =", req.body);
    const user = await get_user(req.body.email, "email");
    if (user === null) {  
        res.status(401).json({ message: "Email not found" });
    }
    else {
        next();
    }
}
