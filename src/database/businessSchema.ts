import mongoose, { Schema } from "mongoose";
import { BusinessCoreSchema } from "./subSchemas";
import { IBusinessCore } from "./types";

export type IBusiness = IBusinessCore & {
  _id?: string;
  clerkUserID: string;
  membershipStartDate: Date;
  lastPayDate?: Date;
  membershipExpiryDate?: Date;
};

const BusinessSchema = new Schema<IBusiness>({
  clerkUserID: { type: String, required: true, unique: true },
  ...BusinessCoreSchema,
  membershipStartDate: { type: Date, required: true },
  lastPayDate: { type: Date, required: false },
  membershipExpiryDate: { type: Date, required: false },
});

export default mongoose.models.Business || mongoose.model("Business", BusinessSchema);
