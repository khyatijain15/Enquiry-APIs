import { Request,Response } from "express";
import Category from "../models/categoryModel";
import { Op } from "sequelize";

//create
export const createCategory = async (req: Request, res: Response) => {
  try {

    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        status: false,
        message: "Name is required",
        data: null
      });
    }

    const image = req.file ? req.file.filename : null;

    const category = await Category.create({
      name,
      image
    });

    res.status(201).json({
      status: true,
      message: "Category created successfully",
      data: category
    });

  } catch (error: any) {

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        status: false,
        message: "Category already exists",
        data: null
      });
    }

    res.status(500).json({
      status: false,
      message: "Error creating category",
      data: null
    });
  }
};

//get all
export const getCategories = async (req: Request, res: Response) => {
  try {

    const { page, limit, search, status } = req.query;

    if (!page && !limit && !search && status === undefined) {

      const categories = await Category.findAll();

      return res.json({
        status: true,
        message: "Categories fetched successfully",
        data: categories
      });
    }

    // pagination
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 5;
    const offset = (pageNumber - 1) * limitNumber;

    const whereCondition: any = {};

   //search - filter
    if (search) {
      whereCondition.name = {
        [Op.like]: `%${search}%`
      };
    }
    if (status !== undefined) {
      if (![0, 1].includes(Number(status))) {
        return res.status(400).json({
          status: false,
          message: "Status must be 0 or 1",
          data: null
        });
      }
      whereCondition.status = Number(status);
    }

    const result = await Category.findAndCountAll({
      where: whereCondition,
      limit: limitNumber,
      offset
    });

    res.json({
      total: result.count,
      page: pageNumber,
      totalPages: Math.ceil(result.count / limitNumber),
      data: result.rows
    });

  } catch (error) {

    res.status(500).json({
      status: false,
      message: "Error fetching categories",
      data: null
    });
  }
};

//get by id
export const getCategoryById=async(req:Request,res:Response)=>{
    try {
        const id=Number(req.params.id);
        const category=await Category.findByPk(id);

        if(!category){
            return res.status(404).json({
                status:false,
                message:"Category not found",
                data:null
            });
        }
        res.json({
            status:true,
            message:"Category fetched successfully",
            data:category
        });
    } catch (error) {
        res.status(500).json({
            status:false,
            message:"Error fetching category",
            data:null
        })
    }
};

//update
export const updateCategory = async (req: Request, res: Response) => {
  try {

    const id = Number(req.params.id);
    const { name } = req.body;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        status: false,
        message: "Category not found",
        data: null
      });
    }

    //to check dupllicate entry
    if (name) {
      const existing = await Category.findOne({
        where: {
          name,
          id: { [Op.ne]: id }
        }
      });

      if (existing) {
        return res.status(400).json({
          status: false,
          message: "Category already exists",
          data: null
        });
      }
    }

    const image = req.file ? req.file.filename : category.getDataValue("image");

    await category.update({
      ...req.body,
      image
    });

    res.json({
      status: true,
      message: "Category updated successfully",
      data: category
    });

  } catch (error) {

    res.status(500).json({
      status: false,
      message: "Error updating category",
      data: null
    });
  }
};

//delete
export const deleteCategory=async(req:Request,res:Response)=>{
    try {
        const id =Number(req.params.id);
        const category=await Category.findByPk(id);
        
        if(!category){
            return res.status(404).json({
                status:false,
                message:"Category not found",
                data:null
            });
        }
        await category.destroy();
        
        res.json({
            status:true,
            message:"Category deleted successfully",
            data:null
        });
    } catch (error) {
        res.status(500).json({
            status:false,
            message:"Error deleting category",
            data:null
        })
    }
}

//change status    
export const changeCategoryStatus = async (req: Request, res: Response) => {
  try {

    const id = Number(req.params.id);
    const { status } = req.body;

    // to validate ID
    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Invalid category ID",
        data: null
      });
    }

    // to validate status
    if (status === undefined || ![0, 1].includes(Number(status))) {
      return res.status(400).json({
        status: false,
        message: "Status must be 0 or 1",
        data: null
      });
    }

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        status: false,
        message: "Category not found",
        data: null
      });
    }

    await category.update({
      status: Number(status) 
    });

    res.json({
      status: true,
      message: "Category status updated successfully",
      data: category
    });

  } catch (error) {

    console.error("STATUS ERROR:", error); 

    res.status(500).json({
      status: false,
      message: "Error updating category status",
      data: null
    });
  }
};