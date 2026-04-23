import express from "express";

import {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
  updateEnquiryStatus
} from "../controllers/enquiryController";

import {
  createEnquiryValidator,
  enquiryIdValidator,
  updateStatusValidator
} from "../validators/enquiryValidator";

import { validate } from "../middleware/validate";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

// create
router.post("/", verifyToken, createEnquiryValidator, validate, createEnquiry);

// get all
router.get("/", verifyToken, getEnquiries);

// get by id
router.get("/:id", verifyToken, enquiryIdValidator, validate, getEnquiryById);

// update
router.put("/:id", verifyToken, enquiryIdValidator, validate, updateEnquiry);

// delete-soft
router.delete("/:id", verifyToken, enquiryIdValidator, validate, deleteEnquiry);

// update status
router.patch(
  "/:id/status",
  verifyToken,
  enquiryIdValidator,
  updateStatusValidator,
  validate,
  updateEnquiryStatus
);

export default router;