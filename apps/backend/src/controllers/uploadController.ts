import { Request, Response } from "express";
import { imagekit } from "../config/imagekit";

export const getUploadAuthParams = (req: Request, res: Response) => {
  try {
    const authParams = imagekit.getAuthenticationParameters();
    return res.json(authParams);
  } catch (error) {
    return res.status(500).json({ error: "Failed to generate auth params" });
  }
};
