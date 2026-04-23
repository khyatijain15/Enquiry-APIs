import { body, param } from "express-validator";

export const createEnquiryValidator = [

  body("caller_name")
    .notEmpty().withMessage("Caller name required"),

  body("contact_number")
    .notEmpty().withMessage("Contact required")
    .isMobilePhone("any").withMessage("Invalid phone"),

  body("email")
    .optional()
    .isEmail().withMessage("Invalid email"),

  body("date_of_call")
    .notEmpty().withMessage("Date required")
    .isISO8601().withMessage("Invalid date format"),

  body("relationship")
    .notEmpty().withMessage("Relationship required"),

  body("caller_address")
    .optional()
    .isString().withMessage("Caller address must be string"),

  body("resident_name")
    .notEmpty().withMessage("Resident name required"),

  body("dob")
    .notEmpty().withMessage("DOB required")
    .isISO8601().withMessage("Invalid DOB format"),

  body("current_location")
    .notEmpty().withMessage("Current location required"),
    
  body("current_address")
    .optional()
    .isString().withMessage("Current address must be string"),

  body("placement_type")
    .notEmpty().withMessage("Placement type required"),

  body("urgency")
    .notEmpty().withMessage("Urgency required")
    .isInt({ min: 1, max: 3 })
    .withMessage("Urgency must be 1,2 or 3"),

  body("methods")
    .isArray({ min: 1 })
    .withMessage("Methods required"),

  body("categories")
    .isArray({ min: 1 })
    .withMessage("Categories required")
];

export const updateStatusValidator = [
  body("status")
    .isInt({ min: 0, max: 2 })
    .withMessage("Status must be 0,1 or 2"),

  body("reason")
    .optional()
    .isString()
];

export const enquiryIdValidator = [
  param("id")
    .isInt().withMessage("Invalid ID")
];