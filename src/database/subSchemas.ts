export const AddressSchema = {
  street: { type: String, required: false },
  city: { type: String, required: false },
  state: { type: String, required: false },
  zip: { type: Number, required: false },
  county: { type: String, required: false },
};

export const ContactSchema = {
  name: { type: String, required: false },
  phoneNumber: { type: Number, required: false },
  email: { type: String, required: false },
};

export const SocialMediaSchema = {
  IG: { type: String },
  twitter: { type: String },
  FB: { type: String },
};

export const BusinessCoreSchema = {
  businessName: { type: String, required: false },
  businessType: { type: String, required: false },
  businessOwner: { type: String, required: false },
  website: { type: String, required: false },
  address: AddressSchema,
  pointOfContact: ContactSchema,
  socialMediaHandles: SocialMediaSchema,
  description: { type: String, required: false },
  logoUrl: { type: String },
  bannerUrl: { type: String },
};
