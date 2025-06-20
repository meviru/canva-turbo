import Design from "../models/design.model";
import { Request, Response } from "express";

export const createDesign = async (req: Request, res: Response) => {
  try {
    const { name, width, height } = req.body;
    const { user } = req as Request & { user?: { id: string } };
    const userId = user?.id;
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
