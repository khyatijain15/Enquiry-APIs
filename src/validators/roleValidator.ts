import { body, param } from "express-validator";

export const createRoleValidator = [
  body("name")
    .notEmpty().withMessage("Name is required"),

  body("shortName")
    .notEmpty().withMessage("Short name is required"),

  body("status")
    .optional()
    .isIn([0, 1, 2]).withMessage("Status must be 0, 1 or 2")
];

export const updateRoleValidator = [
  body("name").optional(),
  body("shortName").optional(),

  body("status")
    .optional()
    .isIn([0, 1, 2]).withMessage("Status must be 0, 1 or 2")
];

export const statusValidator = [
  body("status")
    .notEmpty().withMessage("Status is required")
    .isIn([0, 1, 2]).withMessage("Status must be 0, 1 or 2")
];

export const roleIdValidator = [
  param("id")
    .isInt().withMessage("Invalid role ID")
];