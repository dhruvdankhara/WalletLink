import { Router } from "express";
import { getIcons } from "../controllers/icons.controller.js";

const router = Router();

router.route("/").get(getIcons);

export default router;
