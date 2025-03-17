import express from "express";
import { oauth, refreshAccessToken,getUserInfo } from "../controller/user.controller.js";
import authenticateUser from '../middleware/authMiddleware.js'
const router = express.Router();

router.post("/oauth", oauth); // Login via Google
router.post("/refresh", refreshAccessToken); // Refresh Access Token
router.get("/userinfo", authenticateUser, getUserInfo);
export default router;
