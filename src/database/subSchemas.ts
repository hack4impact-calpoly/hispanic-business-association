export const AddressSchema = {
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: Number, required: true },
};

export const ContactSchema = {
  name: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  email: { type: String, required: true },
};

export const SocialMediaSchema = {
  IG: { type: String },
  twitter: { type: String },
  FB: { type: String },
};

export const BusinessCoreSchema = {
  businessName: { type: String, required: true },
  businessType: { type: String, required: true }, // Enum enforced on frontend
  businessOwner: { type: String, required: true },
  website: { type: String, required: false },

  physicalAddress: AddressSchema,
  mailingAddress: AddressSchema,

  pointOfContact: ContactSchema,
  socialMediaHandles: SocialMediaSchema,
  description: { type: String, required: true },

  organizationType: { type: String, required: true },
  businessScale: { type: String, required: true },
  numberOfEmployees: {
    type: String,
    enum: ["1-10", "11-20", "21-50", "50-99", "100+"],
    required: true,
  },

  logoUrl: { type: String },
  bannerUrl: { type: String },

  gender: {
    type: String,
    enum: ["Female", "Male", "Non-binary", "Prefer not to say", "Other"],
  },
};
