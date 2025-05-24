import mongoose, { Schema } from "mongoose";
import { AddressSchema } from "./subSchemas";
import { IAddress } from "./types";

export type IAdminMailingAddress = {
  address: IAddress;
};

const AdminMailingAddressSchema = new Schema<IAdminMailingAddress>({
  address: AddressSchema,
});

export default mongoose.models.AdminMailingAddress || mongoose.model("AdminMailingAddress", AdminMailingAddressSchema);
