import get_user from "../database/utils/get_user.js";
import { Request, Response, NextFunction } from "express";

export default async function validate_users(req: Request, res: Response, next: NextFunction) {
    console.log("validate_users called");
    console.log("req.body =", req.body);
    const user = await get_user(req.body.username, "username");
    const email = await get_user(req.body.email, "email");
    // console.log("user =", user);
    // console.log("email =", email);
    if(user.rows.length === 0 && email.rows.length === 0){
        next();
    }
    else{
        console.log("user.rows.length =", user.rows.length);
        console.log("email.rows.length =", email.rows.length);
        if(user.rows.length !== 0){
            console.log("Username already exists");
            res.status(401).json({ message: "Username already exists" });
        }
        else{
            console.log("Email already exists");
            res.status(401).json({ message: "Email already exists" });
        }
    }
}
