import express from "express";

import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  changeCategoryStatus
} from "../controllers/categoryController";

import {
  createCategoryValidator,
  updateCategoryValidator,
  categoryIdValidator,
  statusValidator
} from "../validators/categoryValidator";

import { validate } from "../middleware/validate";
import { verifyToken } from "../middleware/authMiddleware";
import upload from "../middleware/upload";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  upload.single("image"),
  createCategoryValidator,
  validate,
  createCategory
);

router.get("/", verifyToken, getCategories);

router.get("/:id", verifyToken, categoryIdValidator, validate, getCategoryById);

router.put(
  "/:id",
  verifyToken,
  upload.single("image"),
  categoryIdValidator,
  updateCategoryValidator,
  validate,
  updateCategory
);

router.delete("/:id", verifyToken, categoryIdValidator, validate, deleteCategory);

router.patch(
  "/:id/status",
  verifyToken,
  categoryIdValidator,
  statusValidator,
  validate,
  changeCategoryStatus
);

export default router;