import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const { JWT_SECRET }= process.env;

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws, request) => {
    console.log("Client connected");
    const url = request.url;
    
    if(!url){
        return;
    }
    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") || "";
    const decoded = jwt.verify(token, JWT_SECRET as string);
    if(typeof decoded === "string"){
        ws.close();
        return;
    }
    if(!decoded || !decoded.user_id){
        ws.close();
        return;
    }
    console.log("room_id =", room_id);
    

    ws.on("message", (message) => {
        console.log(message);
    });
});
