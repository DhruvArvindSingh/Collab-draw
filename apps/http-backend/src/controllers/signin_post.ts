import { Request, Response } from "express";
import { client } from "@repo/db/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const {JWT_SECRET} = process.env;

export default async function signin_post(req: Request, res: Response){
    console.log("post signin received");
    const { email, password } = req.body;
    console.log("email =",email);
    console.log("password =",password);
    const ress = await client.user.findUnique({
        where: {
            email: email,
            password: password
        }
    });
    console.log("user =",ress);
    const user_email = ress?.email;
    console.log("user_email = ", user_email);
    if (ress !== null) {
        const token = jwt.sign({ userId: ress?.id }, JWT_SECRET as string);
        console.log("token = ", token);
        res.cookie("token", token);
        // res.setHeader("token",token);
        res.status(200).json({ 
            cookie:token,
            message: "Signin successful"
        });
    }
    else {
        console.log("user not found");
        res.status(401).json({ message: "Invalid email or password" });
    }
}