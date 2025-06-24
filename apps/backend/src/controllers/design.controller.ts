import Design from "../models/design.model";
import { Request, Response } from "express";

export const createDesign = async (req: Request, res: Response) => {
  try {
    const { name, width, height, userId } = req.body;
    const newDesign = await Design.create({
      name: name || "Untitled Design",
      width,
      height,
      userId,
    });

    res.status(201).json({ success: true, design: newDesign });
  } catch (error) {
    console.error("Error creating design:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
