import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const configureCors = () => {
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [process.env.CORS_ORIGIN as string];

      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept-Version"],
    exposedHeaders: ["X-Total-Count", "Content-Range"],
    credentials: true, // Allow sending cookies
  });
};

export default configureCors;
