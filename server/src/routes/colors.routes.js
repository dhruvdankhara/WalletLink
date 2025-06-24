import { Router } from "express";
import { getColors } from "../controllers/colors.controller.js";

const router = Router();

router.route("/").get(getColors);

export default router;
