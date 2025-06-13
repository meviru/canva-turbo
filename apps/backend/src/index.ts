import express from "express";
import dotenv from "dotenv";
import configureCors from "./config/cors-config";
import connectDB from "./config/db";
import uploadRoutes from "./routes/upload.routes";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(configureCors);
app.use(express.json());
app.use("/api/upload", uploadRoutes);

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
