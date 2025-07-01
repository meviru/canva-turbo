import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import uploadRoutes from "./routes/upload.routes";
import designRoutes from "./routes/design.routes";
import userRoutes from "./routes/user.routes";
import photoRoutes from "./routes/photos.routes";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware setup
app.use(cors());
app.use(express.json());

// Routes setup
app.use("/api/design", designRoutes);
app.use("/api/user", userRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/images", uploadRoutes);

// Database connection
connectDB();

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
