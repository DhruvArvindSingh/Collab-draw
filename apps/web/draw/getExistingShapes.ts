import axios from "axios";
import { HTTP_URL } from "../config/index";

export default async function getExistingShapes(room_id: string) {
    let Shape: any[] = [];
    const response = await axios.post(`${HTTP_URL}/shapes/${room_id}`, {}, {
        withCredentials: true
    });
    if (response.status === 200) {
        console.log("Fetched existing shapes with status 200 response:", response);
        // console.log("Response status:", response.status);
        // console.log("response.data", response.data.shapes);
        // console.log("response.data.shapes", response.data.shapes);
        response.data.shapes?.map((item: any) => {
            // console.log("item", item);
            // console.log("item.shape", item.shape);
            const shape = JSON.parse(item.shape);
            // console.log("shape", shape);
            // console.log("JSON.parse(item.shape)", JSON.parse(item.shape));
            if (shape)
                shape.id = item.id;
                Shape.push(shape);
        });
        return Shape;
        // return response.data.shapes;
    } else {
        console.log("Fetched existing shapes failed with status", response.status);
        // console.log("Response data:", response.data);
        return [];
    }
}
