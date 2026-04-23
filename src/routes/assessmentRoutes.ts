import express from "express";
import {
  saveAssessmentStep,
  getAssessment,
  completeAssessment
} from "../controllers/assessmentController";

import { verifyToken } from "../middleware/authMiddleware";
import { validate } from "../middleware/validate";
import {
  saveStepValidator,
  completeAssessmentValidator
} from "../validators/assessmentValidator";

import { param } from "express-validator";

const router = express.Router();

router.post(
  "/step",
  verifyToken,
  saveStepValidator,
  validate,
  saveAssessmentStep
);

router.get(
  "/:enquiryId",
  verifyToken,
  [
    param("enquiryId")
      .notEmpty()
      .withMessage("enquiryId is required")
      .bail()
      .isInt()
      .withMessage("enquiryId must be a valid integer")
  ],
  validate,
  getAssessment
);
router.post(
  "/complete",
  verifyToken,
  completeAssessmentValidator,
  validate,
  completeAssessment
);

export default router;