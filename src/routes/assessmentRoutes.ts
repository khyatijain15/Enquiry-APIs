import express from "express";
import {
  saveAssessmentStep,
  getAssessment,
  completeAssessment
} from "../controllers/assessmentController";

import { verifyToken } from "../middleware/authMiddleware";
import { validate } from "../middleware/validate";
import { saveStepValidator } from "../validators/assessmentValidator";

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
  getAssessment
);

router.post(
  "/complete",
  verifyToken,
  completeAssessment
);

export default router;