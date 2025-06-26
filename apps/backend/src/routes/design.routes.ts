import express from "express";
import {
  createDesign,
  getDesigns,
  getDesignById,
} from "../controllers/design.controller";

const router = express.Router();

router.post("/create", createDesign);
router.get("/all", getDesigns);
router.get("/:id", getDesignById);

export default router;
