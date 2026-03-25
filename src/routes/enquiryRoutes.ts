import express from "express";

import {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry
} from "../controllers/enquiryController";

import {
  createEnquiryValidator,
  enquiryIdValidator
} from "../validators/enquiryValidator";

import { validate } from "../middleware/validate";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", verifyToken, createEnquiryValidator, validate, createEnquiry);
router.get("/", verifyToken, getEnquiries);
router.get("/:id", verifyToken, enquiryIdValidator, validate, getEnquiryById);
router.put("/:id", verifyToken, enquiryIdValidator, validate, updateEnquiry);
router.delete("/:id", verifyToken, enquiryIdValidator, validate, deleteEnquiry);

export default router;