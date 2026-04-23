import { Request, Response } from "express";
import Assessment from "../models/assessmentModel";
import Enquiry from "../models/enquiryModel";

export const saveAssessmentStep = async (req: Request, res: Response) => {
  try {
    const { enquiryId, step, data } = req.body;

    if (!enquiryId || !step) {
      return res.status(400).json({
        status: false,
        message: "enquiryId and step are required",
        data: null
      });
    }

    const enquiry: any = await Enquiry.findByPk(enquiryId);

    if (!enquiry) {
      return res.status(404).json({
        status: false,
        message: "Enquiry not found",
        data: null
      });
    }

    if (enquiry.status !== 1) {
      return res.status(400).json({
        status: false,
        message: "Assessment allowed only for accepted enquiries",
        data: null
      });
    }

    let assessment: any = await Assessment.findOne({ where: { enquiryId } });

    if (!assessment) {
      assessment = await Assessment.create({ enquiryId });
    }

    const stepMap: any = {
      1: "step1_personalInfo",
      2: "step2_medicalHistory",
      3: "step3_clinical",
      4: "step4_careNeeds",
      5: "step5_behavior",
      6: "step6_endOfLife",
      7: "step7_preferences",
      8: "step8_finance"
    };

    const stepNumber = Number(step);

    if (!stepMap[stepNumber]) {
      return res.status(400).json({
        status: false,
        message: "Invalid step number",
        data: null
      });
    }

    const field = stepMap[stepNumber];

    assessment[field] = data;

    await assessment.save();

    res.json({
      status: true,
      message: `Step ${stepNumber} saved successfully`,
      data: assessment
    });

  } catch (error: any) {
    console.error("SAVE STEP ERROR:", error);

    return res.status(500).json({
      status: false,
      message: "Error saving assessment",
      data: null
    });
  }
};


// GET
export const getAssessment = async (req: Request, res: Response) => {
  try {
    const { enquiryId } = req.params;

    const assessment = await Assessment.findOne({
      where: { enquiryId }
    });

    if (!assessment) {
      return res.status(404).json({
        status: false,
        message: "Assessment not found",
        data: null
      });
    }

    res.json({
      status: true,
      message: "Assessment fetched",
      data: assessment
    });

  } catch (error: any) {
    console.error("GET ERROR:", error);

    return res.status(500).json({
      status: false,
      message: "Error fetching assessment",
      data: null
    });
  }
};


// COMPLETE
export const completeAssessment = async (req: Request, res: Response) => {
  try {
    const { enquiryId } = req.body;

    if (!enquiryId) {
      return res.status(400).json({
        status: false,
        message: "enquiryId is required",
        data: null
      });
    }

    const assessment: any = await Assessment.findOne({
      where: { enquiryId }
    });

    if (!assessment) {
      return res.status(404).json({
        status: false,
        message: "Assessment not found",
        data: null
      });
    }

    const steps = [
      "step1_personalInfo",
      "step2_medicalHistory",
      "step3_clinical",
      "step4_careNeeds",
      "step5_behavior",
      "step6_endOfLife",
      "step7_preferences",
      "step8_finance"
    ];

    for (const step of steps) {
      const value = assessment[step];

      if (!value) {
        return res.status(400).json({
          status: false,
          message: `Please complete ${step}`,
          data: null
        });
      }

      if (typeof value === "object" && Object.keys(value).length === 0) {
        return res.status(400).json({
          status: false,
          message: `${step} cannot be empty`,
          data: null
        });
      }
    }

    // mark complete
    assessment.status = "completed";

    await assessment.save();

    res.json({
      status: true,
      message: "Assessment completed successfully",
      data: assessment
    });

  } catch (error: any) {
    console.error("COMPLETE ERROR:", error);

    return res.status(500).json({
      status: false,
      message: "Error completing assessment",
      data: null
    });
  }
};