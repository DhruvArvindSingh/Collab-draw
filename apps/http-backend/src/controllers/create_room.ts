import { Request, Response } from "express";

export default function create_room(req: Request, res: Response) {
    console.log("create_room called");
    console.log("req.body =", req.body);
    res.status(200).json({ message: "Room created successfully" });
}

