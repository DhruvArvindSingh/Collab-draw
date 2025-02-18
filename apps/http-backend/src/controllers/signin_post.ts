import { Request, Response } from "express";
import client from "../database/index.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const {JWT_SECRET} = process.env;

export default async function signin_post(req: Request, res: Response){
    console.log("post signin received");
    const { email, password } = req.body;
    console.log("email =",email);
    console.log("password =",password);
    const user = await client.query("SELECT * FROM users WHERE email = $1 AND password = $2", [email, password]);
    console.log("user =",user.rows[0]);
    const user_email = user.rows[0].email;
    console.log("user_email = ", user_email);
    if (user.rows.length > 0) {
        const token = jwt.sign({ email: user_email }, JWT_SECRET as string);
        console.log("token = ", token);
        res.cookie("token", token);
        // res.setHeader("token",token);
        res.status(200).json({ 
            cookie:token,
            public_key:user.rows[0].public_key,
            message: "Signin successful"
        });
    }
    else {
        console.log("user not found");
        res.status(401).json({ message: "Invalid email or password" });
    }
}