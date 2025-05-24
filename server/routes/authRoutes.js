import { Router } from "express";
import { login, register, getUserInfo, updateProfile, addProfileImage, removeProfileImage, Logout } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMmiddleware.js";
import multer from "multer";


const authRoutes = Router();

const upload = multer({dest: "upload/profile/"})

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.get("/user-info",verifyToken, getUserInfo);
authRoutes.post("/update-profile",verifyToken, updateProfile);
authRoutes.post("/add-profile-image",verifyToken,upload.single("profile-image"), addProfileImage);
authRoutes.delete("/remove-profile-image", verifyToken, removeProfileImage);
authRoutes.post("/logout" , Logout);

export default authRoutes;