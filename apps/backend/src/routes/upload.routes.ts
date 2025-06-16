import { Router } from "express";
import {
  uploadImage,
  getUploadAuthParams,
} from "../controllers/uploadController";
import multer from "multer";

const router: any = Router();
const upload = multer();

router.get("/auth", getUploadAuthParams);
router.post("/upload", upload.single("file"), uploadImage);

export default router;
