export type BusinessScale = "Corporate" | "Small Business";
export type OrganizationType = "Nonprofit" | "Community" | "Business";
export type BusinessType =
  | "Food"
  | "Housing"
  | "Banking/Finance"
  | "Retail shops"
  | "Wedding/Events"
  | "Automotive"
  | "Community"
  | "Education"
  | "Nonprofit"
  | "Technology"
  | "Marketing";

export type EmployeeRange = "1-10" | "11-20" | "21-50" | "50-99" | "100+";

export type Gender = "Female" | "Male" | "Non-binary" | "Prefer not to say" | "Other";

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
  businessType: BusinessType;
  businessOwner: string;
  website?: string;
  physicalAddress: IAddress;
  mailingAddress: IAddress;
  pointOfContact: IContact;
  socialMediaHandles?: ISocialMedia;
  description: string;
  organizationType: OrganizationType;
  businessScale: BusinessScale;
  numberOfEmployees: EmployeeRange;
  logoUrl?: string;
  bannerUrl?: string;
  gender?: Gender;
}
