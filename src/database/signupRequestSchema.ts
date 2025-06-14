import mongoose, { Schema } from "mongoose";
import { BusinessCoreSchema } from "./subSchemas";
import { IBusinessCore } from "./types";

export type ISignupRequest = IBusinessCore & {
  _id?: string;
  clerkUserID: string;
  date: Date;
  status?: "open" | "closed";
  decision?: null | "approved" | "denied" | "request changes";
  denialMessage?: string;
};

const SignupRequestSchema = new Schema<ISignupRequest>({
  clerkUserID: { type: String, required: true },
  ...BusinessCoreSchema,
  date: { type: Date },
  status: { type: String, enum: ["open", "closed"], default: "open" },
  decision: { type: String, enum: ["approved", "denied", "request changes"], default: null },
  denialMessage: { type: String },
});

export default mongoose.models.SignupRequest || mongoose.model("SignupRequest", SignupRequestSchema);
