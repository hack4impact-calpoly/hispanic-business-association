import { IBusiness } from "@/database/businessSchema";

/**
 * Formats any address for display
 * @param address - Address object
 * @returns Formatted address string
 */
export function formatAddress(address?: { street: string; city: string; state: string; zip: string | number }) {
  if (!address) return "Address not available";

  const { street, city, state, zip } = address;
  return `${street}, ${city}, ${state} ${zip}`;
}

/**
 * Formats a phone number for display
 * @param phoneNumber - Raw phone number
 * @returns Formatted phone number string
 */
export function formatPhoneNumber(phoneNumber?: number | string) {
  if (!phoneNumber) return "Not available";

  const phoneStr = phoneNumber.toString();

  if (phoneStr.length === 10) {
    return `(${phoneStr.slice(0, 3)}) ${phoneStr.slice(3, 6)}-${phoneStr.slice(6)}`;
  } else if (phoneStr.length === 11 && phoneStr[0] === "1") {
    return `(${phoneStr.slice(1, 4)}) ${phoneStr.slice(4, 7)}-${phoneStr.slice(7)}`;
  }

  return phoneStr;
}

/**
 * Extracts display information for the business dashboard
 * @param business - Business data from API
 * @returns Formatted business info for UI components
 */
export function extractBusinessDisplayData(business?: IBusiness) {
  if (!business) return null;

  return {
    businessInfo: {
      name: business.businessName,
      type: business.businessType,
      owner: business.businessOwner,
      website: business.website,
      physicalAddress: business.physicalAddress
        ? {
            formatted: formatAddress(business.physicalAddress),
            street: business.physicalAddress.street,
            city: business.physicalAddress.city,
            state: business.physicalAddress.state,
            zip: business.physicalAddress.zip.toString(),
          }
        : {
            formatted: "Address not available",
            street: "",
            city: "",
            state: "",
            zip: "",
          },

      mailingAddress: business.physicalAddress
        ? {
            formatted: formatAddress(business.physicalAddress),
            street: business.physicalAddress.street,
            city: business.physicalAddress.city,
            state: business.physicalAddress.state,
            zip: business.physicalAddress.zip.toString(),
          }
        : {
            formatted: "Address not available",
            street: "",
            city: "",
            state: "",
            zip: "",
          },
    },

    contactInfo: {
      name: business.pointOfContact.name,
      phoneNumber: formatPhoneNumber(business.pointOfContact.phoneNumber),
      email: business.pointOfContact.email,
      socialMediaHandles: {
        FB: business.socialMediaHandles?.FB,
        IG: business.socialMediaHandles?.IG,
        twitter: business.socialMediaHandles?.twitter,
      },
    },

    about: {
      description: business.description,
    },

    membership: {
      memberSince: business.membershipStartDate
        ? new Date(business.membershipStartDate).toLocaleDateString()
        : "Unknown",
      expiresInMonths: business.membershipExpiryDate
        ? Math.max(
            0,
            Math.floor(
              (new Date(business.membershipExpiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30),
            ),
          )
        : 0,
    },
  };
}
