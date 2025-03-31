import mongoose, { Schema } from "mongoose";

export type IBusiness = {
  clerkUserID: string; // Reference to the User's clerkUserID.
  businessName: string;
  businessType: string;
  businessOwner: string;
  website: string;
  physicalAddress: {
    street: string;
    city: string;
    state: string;
    zip: number;
  };
  mailingAddress: {
    street: string;
    city: string;
    state: string;
    zip: number;
  };
  pointOfContact: {
    name: string;
    phoneNumber: number;
    email: string;
  };
  socialMediaHandles?: {
    IG?: string;
    X?: string;
    FB?: string;
  };
  description: string;
};

// Create the Mongoose schema for Business details.
const BusinessSchema = new Schema<IBusiness>({
  clerkUserID: { type: String, required: true, unique: true },
  businessName: { type: String, required: true, unique: true },
  businessType: { type: String, required: true },
  businessOwner: { type: String, required: true },
  website: { type: String, required: true },
  physicalAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: Number, required: true },
  },
  mailingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: Number, required: true },
  },
  pointOfContact: {
    name: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    email: { type: String, required: true },
  },
  socialMediaHandles: {
    IG: { type: String },
    X: { type: String },
    FB: { type: String },
  },
  description: { type: String, required: true },
});

// Export the model.
export default mongoose.models.Business || mongoose.model("Business", BusinessSchema);
