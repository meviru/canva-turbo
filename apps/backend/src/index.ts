import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import uploadRoutes from "./routes/upload.routes";
import designRoutes from "./routes/design.routes";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use("/api/upload", uploadRoutes);
app.use("/api/design", designRoutes);

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
