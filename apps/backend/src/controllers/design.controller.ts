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

export const getDesigns = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const designs = await Design.find({ userId });

    res.status(200).json({ success: true, designs });
  } catch (error) {
    console.error("Error fetching designs:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const getDesignById: any = async (req: Request, res: Response) => {
  try {
    const designId = req.params.id;
    const design = await Design.findById(designId);

    if (!design) {
      return res
        .status(404)
        .json({ success: false, message: "Design not found" });
    }

    res.status(200).json({ success: true, design });
  } catch (error) {
    console.error("Error fetching design:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
