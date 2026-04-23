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
  reason: status === 2 ? reason : null,
  rejected_at: status === 2 ? "enquiry" : null,
  rejection_date: status === 2 ? new Date() : null
});

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

    const {
      page,
      limit,
      search,
      status,
      category,
      method,
      urgency,
      placement_type,
      startDate,
      endDate
    } = req.query;

 
if (!page && !limit && !search && !status && !category && !method && !urgency && !placement_type && !startDate && !endDate) {

      // fetch all for summary (including declined)
      const allEnquiries = await Enquiry.findAll();

      const total = allEnquiries.length;
      const pending = allEnquiries.filter(e => e.getDataValue("status") === 0).length;
      const accepted = allEnquiries.filter(e => e.getDataValue("status") === 1).length;
      const declined = allEnquiries.filter(e => e.getDataValue("status") === 2).length;

      const enquiries = await Enquiry.findAll({
        where: {
          status: { [Op.ne]: 2 }
        }
      });

      return res.json({
        status: true,
        message: "Enquiries fetched successfully",
        summary: {
          total,
          pending,
          accepted,
          declined
        },
        data: enquiries
      });
    }


    // for pagination and filters
  
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 5;
    const offset = (pageNumber - 1) * limitNumber;

    const whereCondition: any = {};

    //status filter
    if (status === undefined) {
      whereCondition.status = { [Op.ne]: 2 };
    } else {
      whereCondition.status = Number(status);
    }

    //search
    if (search) {
      whereCondition.caller_name = {
        [Op.like]: `%${search}%`
      };
    }

   // urgency
    if (urgency) {
      whereCondition.urgency = Number(urgency);
    }

   //placemnent type
    if (placement_type) {
      whereCondition.placement_type = placement_type;
    }

   //category (JSON)
    if (category) {
      whereCondition.categories = {
        [Op.like]: `%${category}%`
      };
    }

   //method(JSON)
    if (method) {
      whereCondition.methods = {
        [Op.like]: `%${method}%`
      };
    }

    //date range
    if (startDate || endDate) {
    // both must be present
    if (!startDate || !endDate) {
    return res.status(400).json({
      status: false,
      message: "Both startDate and endDate are required",
      data: null
    });
  }

  const start = new Date(String(startDate));
  const end = new Date(String(endDate));

  // invalid date check
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({
      status: false,
      message: "Invalid date format",
      data: null
    });
  }

    // logical check
    if (start > end) {
     return res.status(400).json({
      status: false,
      message: "startDate cannot be greater than endDate",
      data: null
    });
  }

   whereCondition.date_of_call = {
    [Op.between]: [start, end]
  };
}

    //db query with pag. and filter
    const enquiries = await Enquiry.findAndCountAll({
      where: whereCondition,
      limit: limitNumber,
      offset
    });

    res.json({
      status: true,
      message: "Enquiries fetched successfully",
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


//get by id
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

    const enquiry: any = await Enquiry.findByPk(id);

    // if not found or deleted (status=2)
    if (!enquiry || enquiry.getDataValue("status") === 2) {
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

    // await enquiry.update(req.body);
    //allowed fields to update only-
const allowedFields = [
  "caller_name",
  "contact_number",
  "email",
  "relationship",
  "caller_address",
  "resident_name",
  "dob",
  "current_location",
  "current_address",
  "placement_type",
  "urgency",
  "methods",
  "categories",
  "hsc_number",
  "source",
  "diagnosis",
  "mobility",
  "care_needs",
  "medications",
  "preferred_location",
  "date_of_call"
];

// field validation
const requestFields = Object.keys(req.body);

const invalidFields = requestFields.filter(
  (field) => !allowedFields.includes(field)
);

if (invalidFields.length > 0) {
  return res.status(400).json({
    status: false,
    message: `Invalid fields: ${invalidFields.join(", ")}`,
    data: null
  });
}

//build updates
const updates: any = {};

for (const key of allowedFields) {
  if (req.body[key] !== undefined) {
    updates[key] = req.body[key];
  }
}

await enquiry.update(updates);

for (const key of allowedFields) {
  if (req.body[key] !== undefined) {
    updates[key] = req.body[key];
  }
}

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

    //soft delete
    await enquiry.update({ status: 2 });

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