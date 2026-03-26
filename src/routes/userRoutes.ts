import express from "express";

import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from "../controllers/userController";

import {
  createUserValidator,
  userIdValidator
} from "../validators/userValidator";

import { validate } from "../middleware/validate";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  createUserValidator,
  validate,
  createUser
);

router.get(
  "/",
  verifyToken,
  getUsers
);

router.get(
  "/:id",
  verifyToken,
  userIdValidator,
  validate,
  getUserById
);

router.put(
  "/:id",
  verifyToken,
  userIdValidator,
  validate,
  updateUser
);

router.delete(
  "/:id",
  verifyToken,
  userIdValidator,
  validate,
  deleteUser
);

export default router;