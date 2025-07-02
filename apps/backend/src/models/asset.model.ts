import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    fileId: { type: String, required: true },
    fileType: String,
    name: String,
    size: Number,
    width: Number,
    height: Number,
    uploadedBy: String,
    projectId: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export const Asset = mongoose.model("Asset", assetSchema);
