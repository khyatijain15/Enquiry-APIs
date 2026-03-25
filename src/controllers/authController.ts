import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {

  try {

    const { email } = req.body;

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.json({
      status: true,
      message: "Login successful",
      data: { token }
    });

  } catch (error) {

    res.status(500).json({
      status: false,
      message: "Login failed",
      data: null
    });

  }

};