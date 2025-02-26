import mongoose, { Schema } from "mongoose";

export type IRequest = {
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
};

// Create the Mongoose schema for Business details.
const RequestSchema = new Schema<IRequest>({
  clerkUserID: { type: String, required: true, unique: true },
  businessName: { type: String, required: false, unique: true },
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
  date: { type: Date, required: false, default: new Date() },
});

// Export the model.
export default mongoose.models.Request || mongoose.model("Request", RequestSchema);
