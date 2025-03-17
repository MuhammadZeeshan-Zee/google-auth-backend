import { Router } from "express";
import {
  oauth
} from "../controller/user.controller.js";

const router = Router();

router.route("/auth/google").post(oauth);

export default router;
