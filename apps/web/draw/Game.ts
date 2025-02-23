import getExistingShapes from "./getExistingShapes";

export default class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D | null;
    private S_shape: string;
    private room_id: string;
    socket: WebSocket;
    private Shape: any[] = [];
    private clicked: boolean = false;
    private startX: number = 0;
    private startY: number = 0;
    private width: number = 0;
    private height: number = 0;
    private color: string;
    constructor(canvas: HTMLCanvasElement, S_shape: string, room_id: string, socket: WebSocket, color: string) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.S_shape = S_shape;
        this.room_id = room_id;
        this.socket = socket;
        this.color = color;
        if (this.ctx) {
            this.fetchShapes();
            this.initialize();
            this.initHandlers();
        }
    }
    async fetchShapes() {
        console.log("Fetching shapes");
        const shapes = await getExistingShapes(this.room_id);
        this.Shape = shapes;
        console.log("Shapes fetched", shapes);
        this.drawShape();
    }
    setShape(shape: string) {
        console.log("Setting shape", shape);
        this.S_shape = shape;
    }
    setColor(color: string) {
        console.log("Setting color", color);
        this.color = color;
    }
    initialize() {
        this.socket.onmessage = (message) => {
            console.log("New message", message);
            const data = JSON.parse(message.data);
            if (data.type === "update_shape") {
                this.Shape.push(JSON.parse(data.shape));
                this.drawShape();
            }
        }
    }

    initHandlers() {
        console.log("Initializing handlers");
        this.canvas.addEventListener("mousedown", this.handleMouseDown);
        this.canvas.addEventListener("mousemove", this.handleMouseMove);
        this.canvas.addEventListener("mouseup", this.handleMouseUp);
    }
    handleMouseDown = (e: MouseEvent) => {
        console.log("Mouse down", e);
        this.clicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
    }
    handleMouseMove = (e: MouseEvent) => {
        console.log("Mouse move", e);
        if (this.clicked) {
            this.width = e.clientX - this.startX;
            this.height = e.clientY - this.startY;
            console.log("before drawShape");
            this.drawShape();
            console.log("after drawShape");
            if (this.S_shape === "rect") {
                this.ctx!.strokeStyle = this.color;
                this.ctx!.strokeRect(this.startX, this.startY, this.width, this.height);
            }
            else if (this.S_shape === "circle") {
                this.ctx!.strokeStyle = this.color;
                this.ctx!.beginPath();
                this.ctx!.arc(this.startX, this.startY, Math.sqrt(this.width * this.width + this.height * this.height), 0, 2 * Math.PI);
                this.ctx!.stroke();
            }
            else if (this.S_shape === "line") {
                this.ctx!.strokeStyle = this.color;
                this.ctx!.beginPath();
                this.ctx!.moveTo(this.startX, this.startY);
                this.ctx!.lineTo(e.clientX, e.clientY);
                this.ctx!.stroke();
            }
        }
    }
    handleMouseUp = (e: MouseEvent) => {
        console.log("Mouse up", e);
        this.clicked = false;
        if (this.S_shape === "rect") {
            this.Shape.push({ x: this.startX, y: this.startY, width: this.width, height: this.height, type: "rect" });
            this.socket.send(JSON.stringify({
                "type": "update_shape",
                "room_id": this.room_id,
                "shape": `{ "x": ${this.startX}, "y": ${this.startY}, "width": ${this.width}, "height": ${this.height}, "type": "rect", "color": "${this.color}" }`
            }));

        } else if (this.S_shape === "circle") {
            this.Shape.push({ x: this.startX, y: this.startY, radius: Math.sqrt(this.width * this.width + this.height * this.height), type: "circle" });
            this.socket.send(JSON.stringify({
                "type": "update_shape",
                "room_id": this.room_id,
                "shape": `{ "x": ${this.startX}, "y": ${this.startY}, "radius": ${Math.sqrt(this.width * this.width + this.height * this.height)}, "type": "circle", "color": "${this.color}" }`
            }));
        }
        else if (this.S_shape === "line") {
            this.Shape.push({ x: this.startX, y: this.startY, x2: e.clientX, y2: e.clientY, type: "line" });
            this.socket.send(JSON.stringify({
                "type": "update_shape",
                "room_id": this.room_id,
                "shape": `{ "x": ${this.startX}, "y": ${this.startY}, "x2": ${e.clientX}, "y2": ${e.clientY}, "type": "line", "color": "${this.color}" }`
            }));
        }
    }
    drawShape() {
        console.log("Drawing shape");
        this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx!.fillStyle = "black";
        this.ctx?.fillRect(0, 0, this.canvas.width, this.canvas.height);
        console.log("drawing shapes before map");
        this.Shape.map((item) => {
            if (item.type === "rect") {
                this.ctx!.strokeStyle = item.color;
                this.ctx?.strokeRect(item.x, item.y, item.width, item.height);
            } else if (item.type === "circle") {
                this.ctx!.strokeStyle = item.color;
                this.ctx?.beginPath();
                this.ctx?.arc(item.x, item.y, item.radius, 0, 2 * Math.PI);
                this.ctx?.stroke();
            }
            else if (item.type === "line") {
                this.ctx!.strokeStyle = item.color;
                this.ctx?.beginPath();
                this.ctx?.moveTo(item.x, item.y);
                this.ctx?.lineTo(item.x2, item.y2);
                this.ctx?.stroke();
            }
        });
    }
    destroy() {
        console.log("Destroying game");
        this.canvas.removeEventListener("mousedown", this.handleMouseDown);
        this.canvas.removeEventListener("mousemove", this.handleMouseMove);
        this.canvas.removeEventListener("mouseup", this.handleMouseUp);
    }






}
