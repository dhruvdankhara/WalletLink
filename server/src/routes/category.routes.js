import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  EditCategory,
} from "../controllers/category.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(verifyJWT, createCategory).get(verifyJWT, getCategories);

router
  .route("/:id")
  .post(verifyJWT, EditCategory)
  .delete(verifyJWT, deleteCategory);

export default router;
