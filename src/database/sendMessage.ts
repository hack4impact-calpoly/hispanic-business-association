import mongoose, { Schema, Document } from "mongoose";

export interface ISentMessage extends Document {
  subject: string;
  body: string;
  attachments: string[];
  recipient: {
    directlyTo?: string;
    businessType?: string;
  };
  createdAt: Date;
}

const SentMessageSchema: Schema = new Schema(
  {
    subject: { type: String, required: true },
    body: { type: String, required: true },
    attachments: [{ type: String }],
    recipient: {
      directlyTo: { type: String },
      businessType: { type: String },
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false },
);

export default mongoose.models.SentMessage || mongoose.model<ISentMessage>("SentMessage", SentMessageSchema);
