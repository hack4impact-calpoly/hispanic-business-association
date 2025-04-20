import mongoose, { Schema } from "mongoose";

export type IRequest = {
  _id?: string; // MongoDB automatically adds this
  clerkUserID: string; // Reference to the User's clerkUserID.
  businessName: string;
  businessType: string;
  businessOwner: string;
  website: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: number;
    county: string;
  };
  pointOfContact: {
    name: string;
    phoneNumber: number;
    email: string;
  };
  socialMediaHandles?: {
    IG?: string;
    twitter?: string;
    FB?: string;
  };
  description: string;
  date: Date;
  status?: "open" | "closed";
  decision?: null | "approved" | "denied";
  logoUrl?: string;
  bannerUrl?: string;
};

// Create the Mongoose schema for Business details.
const RequestSchema = new Schema<IRequest>({
  clerkUserID: { type: String, required: true },
  businessName: { type: String, required: false },
  businessType: { type: String, required: false },
  businessOwner: { type: String, required: false },
  website: { type: String, required: false },
  address: {
    street: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    zip: { type: Number, required: false },
    county: { type: String, required: false },
  },
  pointOfContact: {
    name: { type: String, required: false },
    phoneNumber: { type: Number, required: false },
    email: { type: String, required: false },
  },
  socialMediaHandles: {
    IG: { type: String },
    twitter: { type: String },
    FB: { type: String },
  },
  description: { type: String, required: false },
  date: { type: Date, required: false, default: Date.now },
  status: { type: String, enum: ["open", "closed"], default: "open" },
  decision: { type: String, enum: ["approved", "denied"], default: null },
  logoUrl: { type: String },
  bannerUrl: { type: String },
});

// Export the model.
export default mongoose.models.Request || mongoose.model("Request", RequestSchema);
