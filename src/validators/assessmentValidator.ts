import { body } from "express-validator";

export const saveStepValidator = [

  body("enquiryId").isInt().withMessage("Enquiry ID required"),

  body("step").isInt({ min: 1, max: 8 }).withMessage("Step must be between 1 and 8"),

  body("data").notEmpty().withMessage("Data is required"),

  //  STEP 1 VALIDATION
  body("data.surname")
    .if(body("step").equals("1"))
    .notEmpty().withMessage("Surname is required"),

  body("data.firstName")
    .if(body("step").equals("1"))
    .notEmpty().withMessage("First Name is required"),

  body("data.address")
    .if(body("step").equals("1"))
    .notEmpty().withMessage("Address is required"),

  //  STEP 2
  body("data.medicalHistory")
    .if(body("step").equals("2"))
    .notEmpty().withMessage("Medical history is required"),

  //  STEP 3
  body("data.painManagement")
    .if(body("step").equals("3"))
    .notEmpty().withMessage("Pain management is required"),

  //  STEP 4
  body("data.personalHygiene")
    .if(body("step").equals("4"))
    .notEmpty().withMessage("Personal hygiene is required"),

  //  STEP 5
  body("data.communication")
    .if(body("step").equals("5"))
    .notEmpty().withMessage("Communication is required"),

  //  STEP 6
  body("data.dnr")
    .if(body("step").equals("6"))
    .notEmpty().withMessage("DNR selection required"),

  //  STEP 7
  body("data.foodPreferences")
    .if(body("step").equals("7"))
    .notEmpty().withMessage("Food preferences required"),

  //  STEP 8
  body("data.canManageFinance")
    .if(body("step").equals("8"))
    .notEmpty().withMessage("Finance info required")

];