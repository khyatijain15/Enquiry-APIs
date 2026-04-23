import { body } from "express-validator";
import Role from "../models/roleModel";

export const registerValidator = [

  body("name")
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("role_id")
  .notEmpty()
  .withMessage("Role ID is required")
  .bail()
  .isInt({ min: 1 })
  .withMessage("Role ID must be a valid integer")
  .bail()
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


export const loginValidator = [

  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")

];