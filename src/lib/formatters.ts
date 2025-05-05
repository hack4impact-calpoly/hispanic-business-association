import { IBusiness } from "@/database/businessSchema";

/**
 * Formats a business address for display
 * @param address - Business address object
 * @returns Formatted address string
 */
export function formatAddress(address?: IBusiness["address"]) {
  if (!address) return "Address not available";

  const { street, city, state, zip, county } = address;
  return `${street}, ${city}, ${state} ${zip}${county ? `, ${county}` : ""}`;
}

/**
 * Formats a phone number for display
 * @param phoneNumber - Raw phone number
 * @returns Formatted phone number string
 */
export function formatPhoneNumber(phoneNumber?: number | string) {
  if (!phoneNumber) return "Not available";

  // Convert to string if it's a number
  const phoneStr = phoneNumber.toString();

  // Handle different formats
  if (phoneStr.length === 10) {
    return `(${phoneStr.slice(0, 3)}) ${phoneStr.slice(3, 6)}-${phoneStr.slice(6)}`;
  } else if (phoneStr.length === 11 && phoneStr[0] === "1") {
    return `(${phoneStr.slice(1, 4)}) ${phoneStr.slice(4, 7)}-${phoneStr.slice(7)}`;
  }

  // Return as is if we can't format it
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
    // Basic info
    businessInfo: {
      name: business.businessName,
      type: business.businessType,
      owner: business.businessOwner,
      website: business.website,
      address: {
        formatted: formatAddress(business.address),
        street: business.address.street,
        suite: "", // Not in the current schema
        city: business.address.city,
        state: business.address.state,
        zip: business.address.zip.toString(),
      },
    },

    // Contact info
    contactInfo: {
      pointOfContact: business.pointOfContact.name,
      phone: formatPhoneNumber(business.pointOfContact.phoneNumber),
      email: business.pointOfContact.email,
      socialMedia:
        business.socialMediaHandles?.FB ||
        business.socialMediaHandles?.IG ||
        business.socialMediaHandles?.twitter ||
        "Not available",
    },

    // About section
    about: {
      description: business.description,
    },

    // Membership info - Not in current schema, could be added later
    membership: {
      memberSince: "November 2023", // Placeholder
      expiresInMonths: 1, // Placeholder
    },
  };
}
