import express from "express";
import { getPhotos } from "../controllers/photos.controller";

const router = express.Router();

router.get("/list", getPhotos);

export default router;
