import express from "express";
import { saveUser } from "../controllers/user.controller";

const router = express.Router();

router.post("/save", saveUser);

export default router;
