import { Request, Response, NextFunction } from "express";

export default function email_format(req: Request, res: Response, next: NextFunction) {
    (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)) ? next() : res.status(401).json({ message: "Invalid email format" });
}