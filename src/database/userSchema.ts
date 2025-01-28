import mongoose, { Schema } from "mongoose";
type IUser = {
  clerkUserID: string;
  email: string;
  name: string;
  phone: number;
  role: string;
};

const UserSchema = new Schema<IUser>({
  clerkUserID: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  role: { type: String, enum: ["admin", "businessOwner"], required: true },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
