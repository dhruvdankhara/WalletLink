import { Router } from "express";
import {
  createAccount,
  deleteAccount,
  getAccountById,
  getAccounts,
  updateAccount,
} from "../controllers/account.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(verifyJWT, createAccount).get(verifyJWT, getAccounts);

router
  .route("/:id")
  .get(verifyJWT, getAccountById)
  .post(verifyJWT, updateAccount)
  .delete(verifyJWT, deleteAccount);

export default router;
