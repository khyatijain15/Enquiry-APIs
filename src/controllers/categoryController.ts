import { Request, Response } from "express";
import Category from "../models/categoryModel";
import { Op } from "sequelize";
import fs from "fs";
import path from "path";

// helper for safe file delete
const deleteFile = (filename: string) => {
  const uploadsDir = path.resolve(__dirname, "../../uploads");
  const filePath = path.resolve(uploadsDir, filename);

  if (filePath.startsWith(uploadsDir) && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

//create
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    // name validation
    if (!name) {
      if (req.file) deleteFile(req.file.filename);

      return res.status(400).json({
        status: false,
        message: "Name is required",
        data: null
      });
    }

    // duplicate check BEFORE create
    const existing = await Category.findOne({ where: { name } });

    if (existing) {
      if (req.file) deleteFile(req.file.filename);

      return res.status(400).json({
        status: false,
        message: "Category already exists",
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

  } catch (error) {

    if (req.file) deleteFile(req.file.filename);

    res.status(500).json({
      status: false,
      message: "Error creating category",
      data: null
    });
  }
};

//get all with pag, search and filter
export const getCategories = async (req: Request, res: Response) => {
  try {
    const { page, limit, search, status } = req.query;

    const whereCondition: any = {};

    
if (status === undefined) {
  whereCondition.status = { [Op.ne]: 2 };
} else {
  const statusNumber = Number(status);

  if (![0, 1, 2].includes(statusNumber)) {
    return res.status(400).json({
      status: false,
      message: "Status must be 0, 1 or 2",
      data: null
    });
  }

  whereCondition.status = statusNumber;
}

    if (search) {
      whereCondition.name = {
        [Op.like]: `%${search}%`
      };
    }

    // no pagination
    if (!page && !limit && !search && status === undefined) {
      const categories = await Category.findAll({ where: whereCondition });

      return res.json({
        status: true,
        message: "Categories fetched successfully",
        data: categories
      });
    }

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 5;
    const offset = (pageNumber - 1) * limitNumber;

    const result = await Category.findAndCountAll({
      where: whereCondition,
      limit: limitNumber,
      offset
    });

    res.json({
      status: true,
      message: "Categories fetched successfully",
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

// get by id
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        status: false,
        message: "Category not found",
        data: null
      });
    }

    res.json({
      status: true,
      message: "Category fetched successfully",
      data: category
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error fetching category",
      data: null
    });
  }
};

// update
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;

    const category = await Category.findByPk(id);

    if (!category) {
      if (req.file) deleteFile(req.file.filename);

      return res.status(404).json({
        status: false,
        message: "Category not found",
        data: null
      });
    }

    // duplicate check
    if (name) {
      const existing = await Category.findOne({
        where: {
          name,
          id: { [Op.ne]: id }
        }
      });

      if (existing) {
        if (req.file) deleteFile(req.file.filename);

        return res.status(400).json({
          status: false,
          message: "Category already exists",
          data: null
        });
      }
    }

    const image = req.file
      ? req.file.filename
      : category.getDataValue("image");

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

    if (req.file) deleteFile(req.file.filename);

    res.status(500).json({
      status: false,
      message: "Error updating category",
      data: null
    });
  }
};

// delete
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        status: false,
        message: "Category not found",
        data: null
      });
    }

    const image = category.getDataValue("image");

    if (image) {
      deleteFile(image);
    }

    await category.update({ status: 2 });

    res.json({
      status: true,
      message: "Category deleted successfully",
      data: null
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error deleting category",
      data: null
    });
  }
};

// change status
export const changeCategoryStatus = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Invalid category ID",
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

    await category.update({ status: Number(status) });

    res.json({
      status: true,
      message: "Category status updated successfully",
      data: category
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error updating category status",
      data: null
    });
  }
};