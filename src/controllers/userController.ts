import { Request, Response } from "express";
import { Op } from "sequelize";
import bcrypt from "bcrypt";
import User from "../models/userModel";


// CREATE USER
export const createUser = async (req: Request, res: Response) => {

  try {

    const { name, email, password, role_id } = req.body;

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "Email already exists",
        data: null
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role_id
    });

    res.status(201).json({
      status: true,
      message: "User created successfully",
      data: {
        id: user.getDataValue("id"),
        name: user.getDataValue("name"),
        email: user.getDataValue("email"),
        role_id: user.getDataValue("role_id")     
      
      }
    });

  } catch (error) {

    res.status(500).json({
      status: false,
      message: "Error creating user",
      data: null
    });

  }

};


// GET USERS
export const getUsers = async (req: Request, res: Response) => {

  try {

    const { page, limit, search, role } = req.query;

    // NORMAL REQUEST
    if (!page && !limit && !search && !role) {

      const users = await User.findAll({
        attributes: { exclude: ["password"] }
      });

      return res.json({
        status: true,
        message: "Users fetched successfully.",
        data: users
      });

    }

    // PAGINATION / SEARCH / FILTER
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 5;
    const offset = (pageNumber - 1) * limitNumber;

    const whereCondition: any = {};
   
// default → exclude deleted
if (req.query.status === undefined) {
  whereCondition.status = { [Op.ne]: 2 };
} else {
  whereCondition.status = Number(req.query.status);
}

    if (search) {
      whereCondition.name = {
        [Op.like]: `%${search}%`
      };
    }

    if (req.query.role_id) {
      whereCondition.role_id = Number(req.query.role_id);
    }

    const users = await User.findAndCountAll({
      where: whereCondition,
      attributes: { exclude: ["password"] },
      limit: limitNumber,
      offset
    });

    res.json({
      total: users.count,
      page: pageNumber,
      totalPages: Math.ceil(users.count / limitNumber),
      data: users.rows
    });

  } catch (error) {

    res.status(500).json({
      status: false,
      message: "Error fetching users",
      data: null
    });

  }

};


// GET USER BY ID
export const getUserById = async (req: Request, res: Response) => {

  try {

    const id = Number(req.params.id);

    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] }
    });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
        data: null
      });
    }

    res.json({
      status: true,
      message: "User fetched successfully",
      data: user
    });

  } catch (error) {

    res.status(500).json({
      status: false,
      message: "Error fetching user",
      data: null
    });

  }

};


// UPDATE USER
export const updateUser = async (req: Request, res: Response) => {

  try {

    const id = Number(req.params.id);

    //find user
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
        data: null
      });
    }

    //only allow required fields- 
    const allowedFields = ["name", "email", "password", "role_id"];
    const updates: any = {};

   for (const key of allowedFields) {
  if (req.body[key] !== undefined) {
    updates[key] = req.body[key];
  }
}

//duplicate email check- 
    if (updates.email) {
      const existingUser = await User.findOne({
        where: {
          email: updates.email,
          id: { [Op.ne]: id }
        }
      });

      if (existingUser) {
        return res.status(400).json({
          status: false,
          message: "Email already exists",
          data: null
        });
      }
    }

// hash password if present
if (updates.password) {
  updates.password = await bcrypt.hash(updates.password, 10);
}

//update user
await user.update(updates);
    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ["password"] }
    });

    res.json({
      status: true,
      message: "User updated successfully",
      data: updatedUser
    });

  } catch (error) {

    res.status(500).json({
      status: false,
      message: "Error updating user",
      data: null
    });

  }

};


// DELETE USER
export const deleteUser = async (req: Request, res: Response) => {

  try {

    const id = Number(req.params.id);

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
        data: null
      });
    }

    // await user.destroy();
    //soft delete
    await user.update({ status: 2 });

    res.json({
      status: true,
      message: "User deleted successfully",
      data: null
    });

  } catch (error) {

    res.status(500).json({
      status: false,
      message: "Error deleting user",
      data: null
    });

  }

};