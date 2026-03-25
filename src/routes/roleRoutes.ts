import express from "express";
import {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
  changeRoleStatus
} from "../controllers/roleController";

import {
  createRoleValidator,
  updateRoleValidator,
  roleIdValidator,
  statusValidator
} from "../validators/roleValidator";

import { validate } from "../middleware/validate";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", verifyToken, createRoleValidator, validate, createRole);

router.get("/", verifyToken, getRoles);

router.get("/:id", verifyToken, roleIdValidator, validate, getRoleById);

router.put("/:id", verifyToken, roleIdValidator, updateRoleValidator, validate, updateRole);

router.delete("/:id", verifyToken, roleIdValidator, validate, deleteRole);

router.patch("/:id/status", verifyToken, roleIdValidator, statusValidator, validate, changeRoleStatus);

export default router;