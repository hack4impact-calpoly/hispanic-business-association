import mongoose, { Schema } from "mongoose";

export type IUser = {
  clerkUserID: string;
  email: string;
  name: string;
  phone: number;
  role: "admin" | "business";
};

const UserSchema = new Schema<IUser>({
  clerkUserID: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  role: { type: String, enum: ["admin", "business"], required: true, default: "business" },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
