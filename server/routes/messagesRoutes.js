import { Router } from "express";
import { verifyToken } from "../middleware/authMmiddleware.js";
import { GetMessages, uploadFile } from "../controllers/messagesController.js";
import multer from "multer";


const messagesRoutes = Router();

const upload = multer({dest: "upload/files"})

messagesRoutes.post("/get-messages", verifyToken, GetMessages);
messagesRoutes.post("/upload-file", verifyToken, upload.single("file"), uploadFile)

export default messagesRoutes;