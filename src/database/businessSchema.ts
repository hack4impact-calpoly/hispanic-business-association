import mongoose, { Schema } from "mongoose";

interface IBusiness {
  businessName: string;
  businessType: string;
  businessOwner: string;
  website: string;
  address: { street: string; city: string; state: string; zip: number; county: string };
  pointOfContact: { name: string; phoneNumber: number; email: string };
  email: string;
  socialMediaHandles: { IG: string; twitter: string; FB: string };
  description: string;
}

//! Example user schema. Not guaranteed to work
const BusinessSchema = new Schema<IBusiness>({
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
  email: { type: String, required: true },
  socialMediaHandles: {
    IG: { type: String, required: false },
    twitter: { type: String, required: false },
    FB: { type: String, required: false },
  },
  description: { type: String, required: true },
});

export default mongoose.models.Business || mongoose.model("Business", BusinessSchema);
