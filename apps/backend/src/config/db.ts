import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`✅ MongoDB connected : ${con.connection.host}`);
  } catch (err) {
    console.error("❌ DB connection error:", err);
    process.exit(1);
  }
};

export default connectDB;
