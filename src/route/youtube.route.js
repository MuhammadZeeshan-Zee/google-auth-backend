import express from "express";
const router = express.Router();
import {youtubeSearch} from '../controller/youtube.controller.js'
router.get("/api/search", youtubeSearch); 
export default router;
