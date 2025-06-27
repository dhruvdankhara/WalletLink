import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUser,
  changeAvatar,
  changeCurrentPassword,
  forgotPassword,
  resetPassword,
} from "../controllers/users.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middlewares.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(logoutUser);

router.route("/me").get(verifyJWT, getCurrentUser);

router.route("/update").post(verifyJWT, updateUser);

router.route("/avatar").post(verifyJWT, upload.single("avatar"), changeAvatar);

router.route("/change-password").post(verifyJWT, changeCurrentPassword);

router.route("/forgot-password").post(forgotPassword);

router.route("/reset-password/:token").post(resetPassword);

export default router;
