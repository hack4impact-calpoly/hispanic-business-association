// ENUM-LIKE CONSTANTS for reuse and consistency
export const ORGANIZATION_TYPES = ["Nonprofit", "Community", "Business"] as const;
export const BUSINESS_TYPES = [
  "Food",
  "Housing",
  "Banking/Finance",
  "Retail shops",
  "Wedding/Events",
  "Automotive",
  "Education",
  "Technology",
  "Marketing",
] as const;
export const BUSINESS_SCALES = ["Corporate", "Small Business"] as const;
export const EMPLOYEE_RANGES = ["1-10", "11-20", "21-50", "51-99", "100+"] as const;
export const GENDER_OPTIONS = ["Female", "Male", "Non-binary", "Prefer not to say", "Other"] as const;

// TYPES from constants
export type OrganizationType = (typeof ORGANIZATION_TYPES)[number];
export type BusinessType = (typeof BUSINESS_TYPES)[number];
export type BusinessScale = (typeof BUSINESS_SCALES)[number];
export type EmployeeRange = (typeof EMPLOYEE_RANGES)[number];
export type Gender = (typeof GENDER_OPTIONS)[number];

// STRUCTURED INTERFACES
export interface IAddress {
  street: string;
  city: string;
  state: string;
  zip: number;
}

export interface IContact {
  name: string;
  phoneNumber: number;
  email: string;
}

export interface ISocialMedia {
  IG?: string;
  twitter?: string;
  FB?: string;
}

export interface IBusinessCore {
  businessName: string;
  businessOwner: string;
  website?: string;
  physicalAddress: IAddress;
  mailingAddress: IAddress;
  pointOfContact: IContact;
  socialMediaHandles?: ISocialMedia;
  description: string;
  organizationType: OrganizationType;
  businessType?: BusinessType; // Optional if org is not "Business"
  businessScale?: BusinessScale;
  numberOfEmployees?: EmployeeRange;
  logoUrl?: string;
  bannerUrl?: string;
  gender?: Gender;
}
