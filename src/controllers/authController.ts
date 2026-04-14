
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/userModel";

//register
export const register=async(req:Request,res:Response)=>{
  try {
    const {name,email,password,role_id}=req.body;
    const existingUser=await User.findOne({where:{email}});

    if(existingUser){
      return res.status(400).json({
        status:false,
        message:"User already exists",
        data:null
      })
    };

    const hashedPassword=await bcrypt.hash(password,10);

    const user=await User.create({
      name,email,password:hashedPassword,role_id
    });
    res.json({
      status:true,
      message:"User registered successfully",
      data:{
        id: user.getDataValue("id"),
        name: user.getDataValue("name"),
        email: user.getDataValue("email"),
        role_id: user.getDataValue("role_id")
      }
    });

  } catch (error) {
    res.status(500).json({
      status:false,
      message:"Registration failed",
      data:null
    });
  }
}

//login
export const login=async(req:Request,res:Response)=>{
  try {
    const {email,password}=req.body;
    const user:any=await User.findOne({where:{email}});

    if(!user){
      return res.status(400).json({
        status:false,
        message:"User not found",
        data:null
      });
    }
    // const validPassword=await bcrypt.compare(password,user.password);
    const validPassword = await bcrypt.compare(
  password,
  user.getDataValue("password")
);
    if(!validPassword){
      return res.status(401).json({
        status:false,
        message:"Invalid password",
        data:null
      })
    }

    const token=jwt.sign({
      id:user.id,
      role_id:user.role_id
    },
      process.env.JWT_SECRET as string,
    {expiresIn:"1h"});

    res.json({
      status:true,
      message:"Login successful",
      data:{token}
    })

  } catch (error) {
    res.status(500).json({
      status:false,
      message:"Login failed",
      data:null
    });
  }
}