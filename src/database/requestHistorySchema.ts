import mongoose, { Schema } from "mongoose";
import { BusinessCoreSchema } from "./subSchemas";
import { IBusinessCore } from "./types";

export type IRequestHistory = {
  _id?: string;
  clerkUserID: string;
  old: IBusinessCore;
  new: IBusinessCore;
  date: Date;
  expireAt: Date;
  status: "closed";
  decision: "approved" | "denied";
  denialMessage?: string;
};

const RequestHistorySchema = new Schema<IRequestHistory>({
  clerkUserID: { type: String, required: true },
  old: BusinessCoreSchema,
  new: BusinessCoreSchema,
  date: { type: Date, required: true },
  expireAt: {
    type: Date,
    required: true,
    default: () => {
      const date = new Date();
      date.setDate(date.getDate() + 30);
      return date;
    },
  },
  status: { type: String, enum: ["closed"], default: "closed" },
  decision: { type: String, enum: ["approved", "denied"], required: true },
  denialMessage: { type: String },
});

RequestHistorySchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.RequestHistory ||
  mongoose.model("RequestHistory", RequestHistorySchema, "requestHistory");
