import { body, param } from "express-validator";

export const createUserValidator = [

  body("name")
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .isEmail()
    .withMessage("Valid email required"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("role")
    .optional()
    .isIn(["admin","user"])
    .withMessage("Role must be admin or user")

];

export const userIdValidator = [

  param("id")
    .isInt()
    .withMessage("User ID must be a number")

];