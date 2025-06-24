import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTransaction,
  deleteTransaction,
  getTransaction,
  getTransactionById,
  updateTransaction,
} from "../controllers/transaction.controller.js";

const router = Router();

router
  .route("/")
  .post(verifyJWT, createTransaction)
  .get(verifyJWT, getTransaction);

router
  .route("/:id")
  .get(verifyJWT, getTransactionById)
  .post(verifyJWT, updateTransaction)
  .delete(verifyJWT, deleteTransaction);

export default router;
