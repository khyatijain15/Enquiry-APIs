import { body, param } from "express-validator";
import Role from "../models/roleModel";

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

  body("role_id")
    .notEmpty()
    .withMessage("Role ID is required")
    .isInt({ min: 1 })
    .withMessage("Role ID must be a valid integer")
    .custom(async (value) => {
      const role = await Role.findOne({
        where: {
          id: value,
          status: 1  
        }
      });

      if (!role) {
        throw new Error("Invalid or inactive role_id");
      }

      return true;
    })

];

export const userIdValidator = [

  param("id")
    .isInt()
    .withMessage("User ID must be a number")

];