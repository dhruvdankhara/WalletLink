import { Router } from "express";
import { requireAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import {
  categoryBreakdown,
  getAllAccounts,
  getAllMembers,
  getDashboardData,
  getDashboardTransaction,
  monthlyIncomeExpenseChart,
} from "../controllers/dashboard.controller.js";

const router = Router();

router.route("/").get(verifyJWT, requireAdmin, getDashboardData);

router.route("/account").get(verifyJWT, requireAdmin, getAllAccounts);

router.route("/members").get(verifyJWT, requireAdmin, getAllMembers);

router
  .route("/monthly-income-expense")
  .get(verifyJWT, requireAdmin, monthlyIncomeExpenseChart);

router
  .route("/transactions")
  .get(verifyJWT, requireAdmin, getDashboardTransaction);

router
  .route("/category-breakdown")
  .get(verifyJWT, requireAdmin, categoryBreakdown);

export default router;
