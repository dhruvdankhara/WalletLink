import { Router } from "express";
import { requireAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import {
  categoryBreakdown,
  getAllAccounts,
  getAllMembers,
  getDashboardTransaction,
  monthlyIncomeExpenseChart,
} from "../controllers/dashboard.controller.js";

const router = Router();

router.route("/account").get(verifyJWT, getAllAccounts);

router.route("/members").get(verifyJWT, getAllMembers);

router
  .route("/monthly-income-expense")
  .get(verifyJWT, monthlyIncomeExpenseChart);

router.route("/transactions").get(verifyJWT, getDashboardTransaction);

router.route("/category-breakdown").get(verifyJWT, categoryBreakdown);

export default router;
