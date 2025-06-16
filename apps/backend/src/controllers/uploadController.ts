import { Request, Response } from "express";
import { imagekit } from "../config/imagekit";
import { Asset } from "../models/Asset";

export const getUploadAuthParams = (req: Request, res: Response) => {
  try {
    const authParams = imagekit.getAuthenticationParameters();
    return res.json(authParams);
  } catch (error) {
    return res.status(500).json({ error: "Failed to generate auth params" });
  }
};
export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });

    const { projectId, uploadedBy, metadata } = req.body;

    const uploadResponse = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
    });

    const asset = await Asset.create({
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
      fileType: req.file.mimetype,
      name: req.file.originalname,
      size: req.file.size,
      uploadedBy,
      projectId,
      layerMeta: metadata ? JSON.parse(metadata) : undefined,
    });

    res.status(201).json({ success: true, data: asset });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: "Failed to upload image" });
  }
};
