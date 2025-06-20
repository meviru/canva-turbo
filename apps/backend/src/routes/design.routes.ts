import express from "express";
import { createDesign } from "../controllers/design.controller";

const router = express.Router();

router.post("/create", createDesign);

export default router;
