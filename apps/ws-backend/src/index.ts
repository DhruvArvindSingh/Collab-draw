import { WebSocket, WebSocketServer } from "ws";
import { client } from "@repo/db/client";
import createShape from "./dbquery/createShape.js";
import deleteShape from "./dbquery/deleteShape.js";
import findUser from "./utils/findUser.js";
import verify_token from "./utils/verifyToken.js";


const wss = new WebSocketServer({ port: 8080 });

interface User {
    ws: WebSocket;
    user_id: number;
    room_id: string[];
}

let users: User[] = [];


// Create WebSocket server attached to the HTTP server



wss.on("connection", async function connection(ws, request) {
    console.log("Client connected");
    const url = request.url;
    if (!url) {
        return;
    }
    try {
        const queryParams = new URLSearchParams(url.split("?")[1]);
        const token = queryParams.get("token") || "";
        const user_id = verify_token(token);
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
        console.log("message =", message);
        const data = JSON.parse(message.toString());
        const user = findUser(users, ws);
        if (!user) return;
        if (data.type === "join_room") { //{type: "join_room", room_id: "1"}
            console.log("join_room data =", data);
            if (user?.room_id.includes(data.room_id)) {
                console.log("user already in room");
                return;
            }
            user?.room_id.push(data.room_id);
            console.log("join_room user =", user);
        }
        if (data.type === "leave_room") { //{type: "leave_room", room_id: "1"}
            if (!user?.room_id.includes(data.room_id)) {
                console.log("user not in room");
                return;
            }
            user.room_id = user.room_id.filter((room) => room !== data.room_id);
            console.log("leave_room user =", user);
        }
        if (data.type === "update_shape") {//{type: "chat", message: "hello", room_id: "1"}
            let shape = data.shape;
            const id = data.id;
            const room_id = data.room_id;
            console.log("shape shape =", shape);
            // console.log("shape room_id =", room_id);
            const res = await createShape(shape, room_id, user.user_id);
            console.log("res =", res);
            users.forEach((user) => {
                if (user.room_id.includes(room_id)) {
                    user.ws.send(JSON.stringify({
                        'type': "update_shape",
                        'shape': `${shape}`,
                        'room_id': `${room_id}`,
                        'id': res.id
                    }));
                }
            });
        }
        if (data.type === "delete_shape") {
            console.log("delete_shape data =", data);
            const shape = JSON.parse(data.shape);
            console.log("shape =", shape);
            const room_id = data.room_id;
            if (!user.room_id.includes(room_id)) {
                console.log("user not in room");
                return;
            }
            const shapeToDelete = await client.shape.findFirst({
                where: {
                    id: shape.id
                }
            });
            console.log("shapeToDelete =", shapeToDelete);

            if (shapeToDelete) {
                console.log("shapeToDelete =", shapeToDelete);
                const res = await deleteShape(shapeToDelete.id);
                console.log("res =", res);
            }
            users.forEach((user) => {
                if (user.room_id.includes(room_id)) {
                    console.log("sending delete_shape to user =", user);
                    console.log("shape =", shape);
                    console.log("room_id =", room_id);
                    console.log("shape.id =", shape.id);
                    user.ws.send(JSON.stringify({
                        'type': "delete_shape",
                        'id': shape.id,
                        'room_id': room_id
                    }));
                }
            });
        }
    });
});

