import { body, param } from "express-validator";

export const createEnquiryValidator = [

  body("caller_name").notEmpty().withMessage("Caller name required"),

  body("contact_number")
    .notEmpty().withMessage("Contact required")
    .isMobilePhone("any").withMessage("Invalid phone"),

  body("email")
    .notEmpty().withMessage("Email required")
    .isEmail().withMessage("Invalid email"),

  body("date_of_call")
    .notEmpty().withMessage("Date required")
    .isISO8601(),

  body("relationship")
    .notEmpty().withMessage("Relationship required"),

  body("caller_address")
    .notEmpty().withMessage("Caller address required"),

  body("resident_name")
    .notEmpty().withMessage("Resident name required"),

  body("dob")
    .notEmpty().withMessage("DOB required")
    .isISO8601(),

  body("current_location")
    .notEmpty().withMessage("Current location required"),

  body("current_address")
    .notEmpty().withMessage("Current address required"),

  body("placement_type")
    .notEmpty().withMessage("Placement type required"),

  body("urgency")
    .notEmpty().withMessage("Urgency required"),

  body("methods")
    .isArray({ min: 1 }).withMessage("Methods required"),

  body("categories")
    .isArray({ min: 1 }).withMessage("Categories required")

];

export const enquiryIdValidator = [
  param("id").isInt().withMessage("Invalid ID")
];