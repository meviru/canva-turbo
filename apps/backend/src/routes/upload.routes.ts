import { Router } from "express";
import { getUploadAuthParams } from "../controllers/uploadController";

const router: any = Router();

router.get("/auth", getUploadAuthParams);

export default router;
