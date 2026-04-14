import { Request, Response } from "express";
import Assessment from "../models/assessmentModel";
import Enquiry from "../models/enquiryModel";


// SAVE STEP
export const saveAssessmentStep = async (req: Request, res: Response) => {
  try {
    const { enquiryId, step, data } = req.body;

    // CHECK ENQUIRY
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

    // const field = stepMap[step];
    // assessment[field] = data;

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
assessment.currentStep = stepNumber;
assessment.isDraft = true;

await assessment.save();

    res.json({
      status: true,
      message: `Step ${step} saved successfully`,
      data: assessment
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error saving assessment",
      data: null
    });
  }
};


//  GET
export const getAssessment = async (req: Request, res: Response) => {
  try {
    const { enquiryId } = req.params;

    const assessment = await Assessment.findOne({
      where: { enquiryId }
    });

    res.json({
      status: true,
      message: "Assessment fetched",
      data: assessment
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error fetching",
      data: null
    });
  }
};


// COMPLETE
export const completeAssessment = async (req: Request, res: Response) => {
  try {
    const { enquiryId } = req.body;

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

    if (!assessment.step1_personalInfo || !assessment.step8_finance) {
      return res.status(400).json({
        status: false,
        message: "Complete all required steps before submitting",
        data: null
      });
    }

    assessment.status = "completed";
    assessment.isDraft = false;

    await assessment.save();

    res.json({
      status: true,
      message: "Assessment completed successfully",
      data: assessment
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error completing assessment",
      data: null
    });
  }
};