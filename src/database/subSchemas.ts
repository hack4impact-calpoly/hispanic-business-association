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

const EMPLOYEE_RANGE = ["1-10", "11-20", "21-50", "51-99", "100+"];
const BUSINESS_SCALE = ["Corporate", "Small Business"];
const ORG_TYPES = ["Nonprofit", "Community", "Business"];
const BUSINESS_TYPES = [
  "Food",
  "Housing",
  "Banking/Finance",
  "Retail shops",
  "Wedding/Events",
  "Automotive",
  "Education",
  "Technology",
  "Marketing",
  "Other",
];
const GENDER_OPTIONS = ["Female", "Male", "Non-binary", "Prefer not to say", "Other"];

export const BusinessCoreSchema = {
  businessName: { type: String, required: true },
  businessOwner: { type: String, required: true },
  website: { type: String, required: false },

  physicalAddress: AddressSchema,
  mailingAddress: AddressSchema,

  pointOfContact: ContactSchema,
  socialMediaHandles: SocialMediaSchema,
  description: { type: String, required: true },

  organizationType: {
    type: String,
    required: true,
    enum: ORG_TYPES,
  },
  businessType: {
    type: String,
    enum: BUSINESS_TYPES,
    required: function (this: any) {
      return this.organizationType === "Business";
    },
  },
  businessScale: {
    type: String,
    enum: BUSINESS_SCALE,
    required: function (this: any) {
      return this.organizationType === "Business";
    },
  },
  numberOfEmployees: {
    type: String,
    enum: EMPLOYEE_RANGE,
    required: function (this: any) {
      return this.organizationType === "Business";
    },
  },

  gender: {
    type: String,
    enum: GENDER_OPTIONS,
  },

  logoUrl: { type: String }, //not in application
  bannerUrl: { type: String }, //not in application
};
