import mongoose, { Schema } from "mongoose";
import { BusinessCoreSchema } from "./subSchemas";
import { IBusinessCore } from "./types";

export type IRequest = {
  _id?: string;
  clerkUserID: string;
  old: IBusinessCore;
  new: IBusinessCore;
  date: Date;
  status: "open" | "closed";
  decision: null | "approved" | "denied";
  denialMessage?: string;
};

const RequestSchema = new Schema<IRequest>({
  clerkUserID: { type: String, required: true },
  old: BusinessCoreSchema,
  new: BusinessCoreSchema,
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ["open", "closed"], default: "open" },
  decision: { type: String, enum: ["approved", "denied"], default: null },
  denialMessage: { type: String },
});

export default mongoose.models.Request || mongoose.model("Request", RequestSchema);
