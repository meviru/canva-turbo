import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    authId: { type: String, required: true, unique: true },
    name: { type: String },
    email: { type: String, required: true, unique: true },
    image: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
