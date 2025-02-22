import axios from "axios";
import { HTTP_URL } from "../config/index";

export default async function getExistingShapes(room_id: string) {
    const response = await axios.post(`${HTTP_URL}/shapes/${room_id}`, {}, {
        withCredentials: true
    });
    if (response.status === 200) {  
        console.log("Response status:", response.status);
        console.log("response.data", response.data.shapes);
        return response.data.shapes;
    } else {
        console.log("Response status:", response.status);
        console.log("Response data:", response.data);
        return [];
    }
}
