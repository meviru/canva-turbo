import { Request, Response } from "express";
import User from "../models/user.model";

export const saveUser = async (req: Request, res: Response) => {
  try {
    const { authId, name, email, image } = req.body;

    let user = await User.findOne({ authId });
    if (!user) {
      user = await User.create({ authId, name, email, image });
    }

    res.status(200).json({
      success: true,
      message: "User saved successfully",
      user: user,
    });
  } catch (err) {
    res.status(500).json({ message: "Error saving user", error: err });
  }
};
