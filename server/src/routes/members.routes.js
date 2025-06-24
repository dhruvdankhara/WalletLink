import { Router } from "express";
import {
  addMember,
  acceptInvite,
  getMembers,
  deleteMember,
  getMemberById,
  updateMember,
} from "../controllers/members.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(verifyJWT, addMember).get(verifyJWT, getMembers);

router.route("/invite").post(acceptInvite);

router
  .route("/:id")
  .get(verifyJWT, getMemberById)
  .post(verifyJWT, updateMember)
  .delete(verifyJWT, deleteMember);

export default router;
