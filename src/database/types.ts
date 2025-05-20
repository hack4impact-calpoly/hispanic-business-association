// types.ts
export interface IAddress {
  street: string;
  city: string;
  state: string;
  zip: number;
  county?: string;
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
  businessType: string;
  businessOwner: string;
  website: string;
  address: IAddress;
  pointOfContact: IContact;
  socialMediaHandles?: ISocialMedia;
  description: string;
  logoUrl?: string;
  bannerUrl?: string;
}
