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
    private prevX: number = 0;
    private prevY: number = 0;
    private radius: number = 5;
    private lineWidth: number = 5;
    private selectedShapes: any[] = [];
    private color: string;
    constructor(canvas: HTMLCanvasElement, S_shape: string, room_id: string, socket: WebSocket, color: string, lineWidth: number, radius: number) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.S_shape = S_shape;
        this.room_id = room_id;
        this.socket = socket;
        this.color = color;
        this.lineWidth = lineWidth;
        this.radius = radius;
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
        // console.log("Shapes fetched", shapes);
        this.drawShape();
    }
    setShape(shape: string) {
        console.log("Setting shape", shape);
        this.S_shape = shape;
        if (this.selectedShapes.length > 0) {
            console.log("Selected shapes length", this.selectedShapes.length);
            this.selectedShapes.forEach((item) => {
                // console.log("Setting color for shape", item.index);
                this.Shape[item.index].color = item.prevColor;
                console.log("Shape after setting color", this.Shape[item.index]);
            });
            this.sendchanges();
            this.selectedShapes = [];
            this.drawShape();
        }
    }
    sendchanges(){
        this.selectedShapes.forEach((item) => {
            this.socket.send(JSON.stringify({
                'type':"Change_attribute",
                'shape':`${JSON.stringify(this.Shape[item.index])}`,
                'room_id':this.room_id,
                'id':item.index
            }));
        });
    }
    setColor(color: string) {
        console.log("Setting color", color);
        this.color = color;
        if (this.selectedShapes.length > 0) {
            this.selectedShapes.forEach((item, index) => {
                // console.log("Setting color for shape", item.index);
                this.Shape[item.index].color = color;
                this.selectedShapes[index].prevColor = color;
                // console.log("Shape after setting color", this.Shape[item.index]);
            });
            this.drawShape();
        }

    }
    setLineWidth(lineWidth: number) {
        console.log("Setting line width", lineWidth);
        this.lineWidth = lineWidth;
        this.ctx!.lineWidth = this.lineWidth;
        if (this.selectedShapes.length > 0) {
            this.selectedShapes.forEach((item) => {
                // console.log("Setting line width for shape", item.index);
                this.Shape[item.index].lineWidth = lineWidth;
                // console.log("Shape after setting line width", this.Shape[item.index]);
            });
            this.drawShape();
        }
    }
    setRadius(radius: number) {
        console.log("Setting radius", radius);
        this.radius = radius;
        if (this.selectedShapes.length > 0) {
            // console.log("Selected shapes length", this.selectedShapes.length);
            this.selectedShapes.forEach((item) => {
                // console.log("Setting radius for shape", item.index);
                // console.log("item.type", item.type);
                if (this.Shape[item.index].type === "rect") {
                    // console.log("Setting radius for rect", radius);
                    this.Shape[item.index].radius = radius;
                    // console.log("Shape after setting radius", this.Shape[item.index]);

                }
            });
            this.drawShape();
        }
    }
    initialize() {
        this.socket.onmessage = (message) => {
            const data = JSON.parse(message.data);
            console.log("New message with data ", data);
            if (data.type === "update_shape") {
                // console.log("update_shape data", data);
                let shape = JSON.parse(data.shape);
                shape.id = data.id;
                this.Shape.push(shape);
                this.drawShape();
            }
            if (data.type === "delete_shape") {
                // console.log("Deleting shape", data.id);
                this.Shape = this.Shape.filter((item) => {
                    // console.log("delete_shape item", item);
                    // console.log("delete_shape data.id", data.id);
                    // console.log("delete_shape item.id", item.id);
                    if (item.id === data.id) {
                        console.log("Deleting shape", item);
                        return false;
                    }
                    return true;
                });
                this.drawShape();
            }
            if (data.type === "add_id") {
                // console.log("Adding id", data.id);
                // console.log("Adding id shape_id", data.shape_id);
                this.Shape[data.shape_id].id = data.id;
                this.drawShape();
            }
            if (data.type === "Change_attribute") {
                console.log("Change_attribute data", data);
                const shape = JSON.parse(data.shape);
                console.log("shape.id =", shape.id);
                console.log("data.id =", data.id);
                if(this.Shape[data.id].id == shape.id){
                    console.log("Shape id is same");
                    this.Shape[data.id] = shape;
                }
                else{
                    console.log("Shape id is not same");
                    this.Shape.find((item) => {
                        if(item.id == shape.id){
                            this.Shape[data.id] = shape;
                            return true;
                        }
                        return false;
                    });
                }
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
        // console.log("Mouse down", e);
        // console.log("S_shape", this.S_shape);
        this.clicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        (this.S_shape === "doodle") ? (this.prevX = e.clientX, this.prevY = e.clientY) : null;

    }
    handleMouseMove = (e: MouseEvent) => {
        // console.log("Mouse move with S_shape", this.S_shape);
        // console.log("Mouse move", e);
        if (this.clicked) {
            this.width = e.clientX - this.startX;
            this.height = e.clientY - this.startY;
            // console.log("before drawShape");
            this.drawShape();
            // console.log("after drawShape");
            if (this.S_shape === "rect") {
                this.ctx!.strokeStyle = this.color;
                this.ctx!.beginPath();
                this.ctx!.roundRect(this.startX, this.startY, this.width, this.height, this.radius);
                this.ctx!.stroke();
            }
            else if (this.S_shape === "circle") {
                this.ctx!.strokeStyle = this.color;
                this.ctx!.beginPath();
                // this.ctx!.moveTo(this.startX, this.startY);
                this.ctx!.arc(this.startX, this.startY, Math.sqrt(this.width * this.width + this.height * this.height), 0, 2 * Math.PI);
                this.ctx!.stroke();
            }
            else if (this.S_shape === "line") {
                this.ctx!.strokeStyle = this.color;
                this.ctx!.beginPath();
                this.ctx!.moveTo(this.startX, this.startY);
                this.ctx!.lineTo(e.clientX - this.canvas.offsetLeft, e.clientY);
                this.ctx!.stroke();
            }
            else if (this.S_shape === "doodle") {
                // console.log("Doodle");
                // this.ctx!.lineWidth = 5;
                this.ctx!.lineCap = 'round';
                // console.log("prevX", this.prevX);
                // console.log("prevY", this.prevY);
                // console.log("e.clientX", e.clientX);
                // console.log("e.clientY", e.clientY);
                this.ctx!.beginPath();
                this.ctx!.moveTo(this.prevX, this.prevY);
                this.ctx!.lineTo(e.clientX, e.clientY);
                this.ctx!.stroke();
                this.Shape.push({ x: this.prevX, y: this.prevY, x2: e.clientX, y2: e.clientY, type: "line", lineWidth: this.lineWidth });
                this.socket.send(JSON.stringify({
                    "type": "update_shape",
                    "room_id": this.room_id,
                    "shape": `{ "x": ${this.prevX}, "y": ${this.prevY}, "x2": ${e.clientX}, "y2": ${e.clientY}, "type": "line", "color": "${this.color}", "lineWidth": ${this.lineWidth} }`
                }));
                this.prevX = e.clientX;
                this.prevY = e.clientY;
            }
            else if (this.S_shape === "select") {
                this.ctx!.fillStyle = "rgba(57, 208, 231, 0.5)";
                this.ctx!.fillRect(this.startX, this.startY, this.width, this.height);
            }
        }
    }
    handleMouseUp = (e: MouseEvent) => {
        console.log("Mouse up");
        // console.log("Mouse up", e);
        // console.log("Move up line width", this.lineWidth);
        this.clicked = false;
        if (this.S_shape === "rect") {
            // this.Shape.push({ x: this.startX, y: this.startY, width: this.width, height: this.height, type: "rect", lineWidth: this.lineWidth, radius: this.radius });
            this.socket.send(JSON.stringify({
                "id": this.Shape.length - 1,
                "type": "update_shape",
                "room_id": this.room_id,
                "shape": `{ "x": ${this.startX}, "y": ${this.startY}, "width": ${this.width}, "height": ${this.height}, "type": "rect", "color": "${this.color}", "lineWidth": ${this.lineWidth}, "radius": ${this.radius} }`
            }));

        } else if (this.S_shape === "circle") {
            // this.Shape.push({ x: this.startX, y: this.startY, radius: Math.sqrt(this.width * this.width + this.height * this.height), type: "circle", lineWidth: this.lineWidth });
            this.socket.send(JSON.stringify({
                "type": "update_shape",
                "room_id": this.room_id,
                "shape": `{ "x": ${this.startX}, "y": ${this.startY}, "radius": ${Math.sqrt(this.width * this.width + this.height * this.height)}, "type": "circle", "color": "${this.color}", "lineWidth": ${this.lineWidth} }`
            }));
        }
        else if (this.S_shape === "line") {
            // this.Shape.push({ x: this.startX, y: this.startY, x2: e.clientX, y2: e.clientY, type: "line", lineWidth: this.lineWidth });
            this.socket.send(JSON.stringify({
                "type": "update_shape",
                "room_id": this.room_id,
                "shape": `{ "x": ${this.startX}, "y": ${this.startY}, "x2": ${e.clientX}, "y2": ${e.clientY}, "type": "line", "color": "${this.color}", "lineWidth": ${this.lineWidth} }`
            }));
        }
        else if (this.S_shape === "doodle") {
            this.ctx!.stroke();
            this.ctx!.beginPath();
        }
        else if (this.S_shape === "select") {
            this.selectedShapes = this.getShapesInside(this.startX, this.startY, e.clientX, e.clientY);
            console.log("Shapes inside", this.selectedShapes);
            if (this.selectedShapes.length === 0) {
                this.drawShape();
                return;
            }
            this.selectedShapes.forEach((item) => {
                this.Shape[item.index].color = "#FFD700";
                // console.log("this.Shape", this.Shape[index].color);
            });
            this.drawShape();
            this.addListener(this.selectedShapes.map((item) => item.index));
        }
    }
    drawShape() {
        console.log("Drawing shape");
        this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx!.fillStyle = "black";
        this.ctx?.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // console.log("drawing shapes before map");
        this.Shape.map((item) => {
            if (item.type === "rect") {
                // console.log("drawing rect with radius", item.radius);
                this.ctx!.strokeStyle = item.color;
                this.ctx!.lineWidth = item.lineWidth;
                this.ctx?.beginPath();
                this.ctx?.roundRect(item.x, item.y, item.width, item.height, item.radius);
                this.ctx?.stroke();
            } else if (item.type === "circle") {
                this.ctx!.lineWidth = item.lineWidth;
                this.ctx!.strokeStyle = item.color;
                this.ctx?.beginPath();
                this.ctx?.arc(item.x, item.y, item.radius, 0, 2 * Math.PI);
                this.ctx?.stroke();
            }
            else if (item.type === "line") {
                this.ctx!.strokeStyle = item.color;
                this.ctx!.lineWidth = item.lineWidth;
                this.ctx?.beginPath();
                this.ctx?.moveTo(item.x, item.y);
                this.ctx?.lineTo(item.x2, item.y2);
                this.ctx?.stroke();
            }
            // this.ctx!.lineWidth = this.lineWidth;
        });
        this.ctx!.lineWidth = this.lineWidth;
    }
    destroy() {
        console.log("Destroying game");
        this.canvas.removeEventListener("mousedown", this.handleMouseDown);
        this.canvas.removeEventListener("mousemove", this.handleMouseMove);
        this.canvas.removeEventListener("mouseup", this.handleMouseUp);
    }
    getShapesInside(x1: number, y1: number, x2: number, y2: number) {

        let shapeIndex: { index: number, prevColor: string }[] = [];

        this.Shape.forEach((item, index) => {

            if (item.type === "rect") {
                const a1 = item.x;
                const b1 = item.y;
                const a2 = item.x + item.width;
                const b2 = item.y + item.height;
                if ((Math.max(x1, x2) > Math.max(a1, a2)) && (Math.min(x1, x2) < Math.min(a1, a2)) && (Math.max(y1, y2) > Math.max(b1, b2)) && (Math.min(y1, y2) < Math.min(b1, b2))) {
                    // console.log("Rect found", index);
                    // console.log("this.Shape", this.Shape[index]);
                    shapeIndex.push({ index: index, prevColor: item.color });
                }
            }
            else if (item.type === "circle") {
                const a1 = item.x + item.radius;
                const b1 = item.y + item.radius;
                const a2 = item.x - item.radius;
                const b2 = item.y - item.radius;
                if ((Math.max(x1, x2) > Math.max(a1, a2)) && (Math.min(x1, x2) < Math.min(a1, a2)) && (Math.max(y1, y2) > Math.max(b1, b2)) && (Math.min(y1, y2) < Math.min(b1, b2))) {
                    shapeIndex.push({ index: index, prevColor: item.color });
                }
            }
            else if (item.type === "line") {
                const a1 = item.x;
                const b1 = item.y;
                const a2 = item.x2;
                const b2 = item.y2;
                if ((Math.max(x1, x2) > Math.max(a1, a2)) && (Math.min(x1, x2) < Math.min(a1, a2)) && (Math.max(y1, y2) > Math.max(b1, b2)) && (Math.min(y1, y2) < Math.min(b1, b2))) {
                    shapeIndex.push({ index: index, prevColor: item.color });
                }
            }
        });
        return shapeIndex;
    }
    addListener(indexs: number[]) {
        console.log("Adding listener for ", indexs);
        const deleteButton = document.getElementById(`delete-btn`);
        deleteButton?.addEventListener("click", () => {
            console.log("Deleting shapes", indexs);
            this.Shape = this.Shape.filter((item, index) => {
                // console.log("index", index);
                if (indexs.includes(index)) {
                    console.log("index", index);
                    if (this.Shape[index].id == undefined || this.Shape[index].id == null) {
                        console.error("shape id is undefined");
                        return false;
                    }
                    const shape = JSON.stringify(this.Shape[index]);
                    this.socket.send(JSON.stringify({
                        "type": "delete_shape",
                        "room_id": this.room_id,
                        "shape": `${shape}`
                    }));
                }
                return !indexs.includes(index);
            });
            this.drawShape();
        }, { once: true });

    }






}
