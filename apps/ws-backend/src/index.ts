import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { client } from "@repo/db/client";
import dotenv from "dotenv";
dotenv.config();


const wss = new WebSocketServer({ port: 8080 });
const { JWT_SECRET } = process.env;
interface User {
    ws: WebSocket;
    user_id: number;
    room_id: string[];
}

let users: User[] = [];


// Create WebSocket server attached to the HTTP server

function verify_token(token: string): string | null {
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

wss.on("connection", async function connection(ws, request) {
    console.log("Client connected");
    const url = request.url;
    if (!url) {
        return;
    }
    try {
        const queryParams = new URLSearchParams(url.split("?")[1]);
        const token = queryParams.get("token") || "";
        // console.log("token =", token);
        const user_id = verify_token(token);
        console.log("user_id =", user_id);
        // console.log("typeof users =", typeof user_id);
        if (!user_id) {
            ws.close();
            return;
        }
        users.push({
            ws: ws,
            user_id: parseInt(user_id),
            room_id: []
        });
        console.log("users =", users);
    }
    catch (error) {
        ws.close();
        console.log("Unauthorized user with no token");
        return;
    }


    ws.on("message", async (message) => {
        const data = JSON.parse(message.toString());
        if (data.type === "join_room") { //{type: "join_room", room_id: "1"}
            const user = users.find((user) => user.ws === ws);
            if (user?.room_id.includes(data.room_id)) {
                console.log("user already in room");
                return;
            }
            user?.room_id.push(data.room_id);
            console.log("join_room user =", user);
        }
        if (data.type === "leave_room") { //{type: "leave_room", room_id: "1"}
            const user = users.find((user) => user.ws === ws);
            if (user) {
                if (!user?.room_id.includes(data.room_id)) {
                    console.log("user not in room");
                    return;
                }
                user.room_id = user.room_id.filter((room) => room !== data.room_id);
                console.log("leave_room user =", user);
            } else {
                console.log("user not found");
                return;
            }
        }
        if (data.type === "chat") {
            //{type: "chat", message: "hello", room_id: "1"}
            const message = data.message;
            const room_id = data.room_id;
            console.log("chat message =", message);
            console.log("chat room_id =", room_id);
            const user = users.find((user) => user.ws === ws);
            if (!user) {
                console.log("user not found");
                return;
            }
            const res = await client.chat.create({
                data: {
                    message: message,
                    roomID: parseInt(room_id),
                    userID: user.user_id
                }
            });
            users.forEach((user) => {
                if (user.room_id.includes(room_id)) {
                    user.ws.send(JSON.stringify({
                        type: "chat",
                        message: message,
                        room_id: room_id
                    }));
                }
            });
        }
    });
});

