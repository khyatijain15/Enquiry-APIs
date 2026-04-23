import { body, param } from "express-validator";

export const createCategoryValidator = [
  body("name")
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2 }).withMessage("Name too short"),

  body("status")
    .optional()
    .isIn([0, 1, 2]).withMessage("Status must be 0, 1 or 2")
];

export const updateCategoryValidator = [
  body("name")
    .optional()
    .isLength({ min: 2 }).withMessage("Name too short"),

  body("status")
    .optional()
    .isIn([0, 1, 2]).withMessage("Status must be 0, 1 or 2")
];

export const statusValidator = [
  body("status")
    .notEmpty().withMessage("Status is required")
    .isIn([0, 1, 2]).withMessage("Status must be 0, 1 or 2")
];

export const categoryIdValidator = [
  param("id")
    .isInt().withMessage("Invalid category ID")
];