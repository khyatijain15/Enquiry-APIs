import { Request, Response } from "express";
import { Op } from "sequelize";
import Enquiry from "../models/enquiryModel";


// CREATE
export const createEnquiry = async (req: Request, res: Response) => {

  try {

    if (!Object.keys(req.body).length) {
      return res.status(400).json({
        status: false,
        message: "Request body cannot be empty",
        data: null
      });
    }

    //urgency
    const {urgency} = req.body;
    if(![1,2,3].includes(Number(urgency))){
      return res.status(400).json({
        status:false,
        message:"Invalid urgency value",
        data:null
      })
    };

    //default status
    req.body.status=0;
    req.body.user_id=(req as any).user.id;

    const enquiry = await Enquiry.create(req.body);

    res.status(201).json({
      status: true,
      message: "Enquiry created successfully",
      data: enquiry
    });

  } catch (error: any) {

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        status: false,
        message: "Duplicate enquiry already exists (DB level)",
        data: null
      });
    }

    res.status(500).json({
      status: false,
      message: "Error creating enquiry",
      data: null
    });

  }

};

//update status
export const updateEnquiryStatus = async (req: Request, res: Response) => {
try {
  const id=Number(req.params.id);
  const status=Number(req.body.status);
  const reason=req.body.reason;

  if(![0,1,2].includes(Number(status))){
    return res.status(400).json({
      status:false,
      message:"Invalid status value",
      data:null
    })
  }

  const enquiry=await Enquiry.findByPk(id);

  if(!enquiry){
    return res.status(404).json({
      status:false,
      message:"Enquiry not found",
      data:null
    })
  }
  //decline if no reason
  if(status===2 && !reason){
    return res.status(400).json({
      status:false,
      message:"Reason is required when declining an enquiry",
      data:null
    })
  };

  await enquiry.update({
    status,
    reason:status==2 ? reason : null

  })
  return res.json({
    status:true,
    message:"Enquiry status updated successfully",
    data: enquiry
  })
} catch (error) {
  res.status(500).json({
    status:false,
    message:"Error updating enquiry status",
    data:null
  })
}
}


// GET ALL 
export const getEnquiries = async (req: Request, res: Response) => {

  try {

    const { page, limit, search } = req.query;

    if (!page && !limit && !search) {

      const enquiries = await Enquiry.findAll();

      return res.json({
        status: true,
        message: "Enquiries fetched successfully",
        data: enquiries
      });

    }

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 5;
    const offset = (pageNumber - 1) * limitNumber;

    const whereCondition: any = {};

    if (search) {
      whereCondition.caller_name = {
        [Op.like]: `%${search}%`
      };
    }

    const enquiries = await Enquiry.findAndCountAll({
      where: whereCondition,
      limit: limitNumber,
      offset
    });

    res.json({
      total: enquiries.count,
      page: pageNumber,
      totalPages: Math.ceil(enquiries.count / limitNumber),
      data: enquiries.rows
    });

  } catch (error) {

    res.status(500).json({
      status: false,
      message: "Error fetching enquiries",
      data: null
    });

  }

};


// GET BY ID
export const getEnquiryById = async (req: Request, res: Response) => {

  try {

    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid ID",
        data: null
      });
    }

    const enquiry = await Enquiry.findByPk(id);

    if (!enquiry) {
      return res.status(404).json({
        status: false,
        message: "Enquiry not found",
        data: null
      });
    }

    res.json({
      status: true,
      message: "Enquiry fetched successfully",
      data: enquiry
    });

  } catch (error) {

    res.status(500).json({
      status: false,
      message: "Error fetching enquiry",
      data: null
    });

  }

};


// UPDATE
export const updateEnquiry = async (req: Request, res: Response) => {

  try {

    const id = Number(req.params.id);

    const enquiry = await Enquiry.findByPk(id);

    if (!enquiry) {
      return res.status(404).json({
        status: false,
        message: "Enquiry not found",
        data: null
      });
    }

    await enquiry.update(req.body);

    res.json({
      status: true,
      message: "Enquiry updated successfully",
      data: enquiry
    });

  } catch (error) {

    res.status(500).json({
      status: false,
      message: "Error updating enquiry",
      data: null
    });

  }

};


// DELETE
export const deleteEnquiry = async (req: Request, res: Response) => {

  try {

    const id = Number(req.params.id);

    const enquiry = await Enquiry.findByPk(id);

    if (!enquiry) {
      return res.status(404).json({
        status: false,
        message: "Enquiry not found",
        data: null
      });
    }

    await enquiry.destroy();

    res.json({
      status: true,
      message: "Enquiry deleted successfully",
      data: null
    });

  } catch (error) {

    res.status(500).json({
      status: false,
      message: "Error deleting enquiry",
      data: null
    });

  }

};