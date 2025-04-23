import { WebSocket } from 'ws';
interface User {
    ws: WebSocket;
    user_id: number;
    room_id: string[];
}
export default function findUser(users: User[], ws: WebSocket): User | undefined;
export {};
//# sourceMappingURL=findUser.d.ts.map