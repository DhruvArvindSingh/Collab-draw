import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pass_format from "./middleware/pass_format.js";
import email_format from "./middleware/email_format.js";
import signup_post from "./controllers/signup_post.js";
import signin_post from "./controllers/signin_post.js";
import create_room from "./controllers/create_room.js";
import get_shapes from "./controllers/get_shapes.js";
import check_email from "./middleware/check_email.js";
import validate_users from "./middleware/validate_users.js";
import dotenv from "dotenv";
import verify from "./middleware/verify.js";

dotenv.config();
const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.post("/signup", pass_format, email_format, validate_users, signup_post);
app.post("/signin", email_format, check_email, signin_post);
app.post("/create_room", verify, create_room);
app.post("/shapes/:room_id", verify, get_shapes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

