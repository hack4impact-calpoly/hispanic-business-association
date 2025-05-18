import mongoose, { Schema } from "mongoose";

// Define shared business info structure for both old and new states
const BusinessInfoSchema = {
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
  logoUrl: { type: String },
  bannerUrl: { type: String },
};

export type IRequestHistory = {
  _id?: string;
  clerkUserID: string;
  old: {
    businessName?: string;
    businessType?: string;
    businessOwner?: string;
    website?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zip?: number;
      county?: string;
    };
    pointOfContact?: {
      name?: string;
      phoneNumber?: number;
      email?: string;
    };
    socialMediaHandles?: {
      IG?: string;
      twitter?: string;
      FB?: string;
    };
    description?: string;
    logoUrl?: string;
    bannerUrl?: string;
  };
  new: {
    businessName?: string;
    businessType?: string;
    businessOwner?: string;
    website?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zip?: number;
      county?: string;
    };
    pointOfContact?: {
      name?: string;
      phoneNumber?: number;
      email?: string;
    };
    socialMediaHandles?: {
      IG?: string;
      twitter?: string;
      FB?: string;
    };
    description?: string;
    logoUrl?: string;
    bannerUrl?: string;
  };
  date: Date;
  expireAt: Date; // TTL field
  status: "closed";
  decision: "approved" | "denied";
  denialMessage?: string;
};

// Create the Mongoose schema for RequestHistory
const RequestHistorySchema = new Schema<IRequestHistory>({
  clerkUserID: { type: String, required: true },
  old: BusinessInfoSchema,
  new: BusinessInfoSchema,
  date: { type: Date, required: true },
  expireAt: {
    type: Date,
    required: true,
    default: () => {
      const date = new Date();
      date.setDate(date.getDate() + 30); // Add 30 days to current date
      return date;
    },
  },
  status: { type: String, enum: ["closed"], default: "closed" },
  decision: { type: String, enum: ["approved", "denied"], required: true },
  denialMessage: { type: String },
});

// Create TTL index on expireAt field for automatic document expiration
RequestHistorySchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

// Export the model
export default mongoose.models.RequestHistory ||
  mongoose.model("RequestHistory", RequestHistorySchema, "requestHistory");
