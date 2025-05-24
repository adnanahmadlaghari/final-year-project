import express, { json } from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import authRoutes from "./routes/authRoutes.js"
import contactsRoutes from "./routes/contactRoutes.js"
import setupSocket from "./socket.js"
import messagesRoutes from "./routes/messagesRoutes.js"
import channelRoutes from "./routes/channelRoutes.js"


dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const dataBaseUrl = process.env.DATABASE_URL;

app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
}));

app.use("/upload/profile", express.static("upload/profile"))
app.use("/upload/files", express.static("upload/files"))

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/channel", channelRoutes);


const server = app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`)
});

setupSocket(server);

mongoose.connect(dataBaseUrl).then(() => console.log("DB connect successfull")).catch((err) => console.log(err.message))