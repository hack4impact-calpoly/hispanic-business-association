import mongoose, { Schema } from "mongoose";
type IUser = {
  clerkUserID: string;
  email: string;
  name: string;
  phone: number;
  role: "admin" | "business";
  business: {
    businessName: string;
    businessType: string;
    businessOwner: string;
    website: string;
    address: { street: string; city: string; state: string; zip: number; county: string };
    pointOfContact: { name: string; phoneNumber: number; email: string };
    socialMediaHandles: { IG: string; twitter: string; FB: string };
    description: string;
  };
};

const UserSchema = new Schema<IUser>({
  clerkUserID: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  role: { type: String, enum: ["admin", "business"], required: true, default: "business" },
  business: {
    businessName: { type: String, required: true, unique: true },
    businessType: { type: String, required: true },
    businessOwner: { type: String, required: true },
    website: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: Number, required: true },
      county: { type: String, required: true },
    },
    pointOfContact: {
      name: { type: String, required: true },
      phoneNumber: { type: Number, required: true },
      email: { type: String, required: true },
    },
    socialMediaHandles: {
      IG: { type: String, required: false },
      twitter: { type: String, required: false },
      FB: { type: String, required: false },
    },
    description: { type: String, required: true },
  },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
