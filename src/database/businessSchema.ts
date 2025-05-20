import mongoose, { Schema } from "mongoose";
import { BusinessCoreSchema } from "./subSchemas";
import { IBusinessCore } from "./types";

export type IBusiness = IBusinessCore & {
  _id?: string;
  clerkUserID: string;
  membershipFeeType?: string;
  lastPayDate?: Date;
  membershipExpiryDate?: Date;
};

const BusinessSchema = new Schema<IBusiness>({
  clerkUserID: { type: String, required: true, unique: true },
  ...BusinessCoreSchema,
  membershipFeeType: { type: String },
  lastPayDate: { type: Date },
  membershipExpiryDate: { type: Date },
});

export default mongoose.models.Business || mongoose.model("Business", BusinessSchema);
