import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/database/db";
import SignupRequest from "@/database/signupRequestSchema";
import { currentUser } from "@clerk/nextjs/server";

// Validation function to check required fields
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Email validation - requires proper local@domain.tld format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Reject obvious invalid patterns
  if (
    email.includes("..") ||
    email.startsWith(".") ||
    email.endsWith(".") ||
    email.includes("@.") ||
    email.includes(".@")
  ) {
    return false;
  }

  return emailRegex.test(email);
}

function validateSignupRequest(body: any): ValidationResult {
  const errors: string[] = [];

  // Validate required top-level fields
  if (!body.businessName?.trim()) {
    errors.push("Business name is required");
  }

  if (!body.businessOwner?.trim()) {
    errors.push("Business owner is required");
  }

  if (!body.organizationType?.trim()) {
    errors.push("Organization type is required");
  }

  if (!body.gender?.trim()) {
    errors.push("Gender is required");
  }

  // Validate business-specific fields
  if (body.organizationType === "Business") {
    if (!body.businessType?.trim()) {
      errors.push("Business type is required for business organizations");
    }
    if (!body.businessScale?.trim()) {
      errors.push("Business scale is required for business organizations");
    }
    if (!body.numberOfEmployees?.trim()) {
      errors.push("Number of employees is required for business organizations");
    }
  }

  // Validate physical address
  if (!body.physicalAddress) {
    errors.push("Physical address is required");
  } else {
    if (!body.physicalAddress.street?.trim()) {
      errors.push("Physical address street is required");
    }
    if (!body.physicalAddress.city?.trim()) {
      errors.push("Physical address city is required");
    }
    if (!body.physicalAddress.state?.trim()) {
      errors.push("Physical address state is required");
    }
    if (!body.physicalAddress.zip) {
      errors.push("Physical address ZIP code is required");
    } else {
      const zipRegex = /^\d{5}$/;
      if (!zipRegex.test(body.physicalAddress.zip.toString())) {
        errors.push("Physical address ZIP code must be exactly 5 digits");
      }
    }
  }

  // Validate mailing address
  if (!body.mailingAddress) {
    errors.push("Mailing address is required");
  } else {
    if (!body.mailingAddress.street?.trim()) {
      errors.push("Mailing address street is required");
    }
    if (!body.mailingAddress.city?.trim()) {
      errors.push("Mailing address city is required");
    }
    if (!body.mailingAddress.state?.trim()) {
      errors.push("Mailing address state is required");
    }
    if (!body.mailingAddress.zip) {
      errors.push("Mailing address ZIP code is required");
    }
  }

  // Validate point of contact
  if (!body.pointOfContact) {
    errors.push("Point of contact information is required");
  } else {
    if (!body.pointOfContact.name?.trim()) {
      errors.push("Contact name is required");
    }
    if (!body.pointOfContact.email?.trim()) {
      errors.push("Contact email is required");
    } else if (!isValidEmail(body.pointOfContact.email.trim())) {
      // Check format after confirming email exists and is not empty
      errors.push("Contact email format is invalid");
    }
    if (!body.pointOfContact.phoneNumber) {
      errors.push("Contact phone number is required");
    } else {
      const phoneStr = body.pointOfContact.phoneNumber.toString().replace(/\D/g, "");
      if (phoneStr.length !== 10) {
        errors.push("Contact phone number must be exactly 10 digits");
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify admin role authorization
    if (user.publicMetadata?.role !== "admin") {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }

    await connectDB();

    // Get all requests from mongo
    const requestData = await SignupRequest.find({});
    return NextResponse.json(requestData);
  } catch (error) {
    console.error("Error fetching request:", error);
    return NextResponse.json({ message: "Failed to fetch request" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Retrieve current user from Clerk
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }

    // Check for malformed user object
    if (!user.id) {
      return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }

    const body = await req.json();

    // Validate request body exists
    if (body === null) {
      return NextResponse.json({ message: "Request is empty." }, { status: 400 });
    }

    // Validate request data
    const validation = validateSignupRequest(body);

    // Add this check - currently missing!
    if (!validation.isValid) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validation.errors,
        },
        { status: 400 },
      );
    }

    // Connect to DB
    await connectDB();

    // Get the clerkUserID from the body or use the current user's ID
    const clerkUserID = body["clerkUserID"] || user.id;

    // Build socialMediaHandles with non-empty values only
    const socialMediaHandles: Record<string, string> = {};
    if (body.socialMediaHandles?.IG) socialMediaHandles.IG = body.socialMediaHandles.IG;
    if (body.socialMediaHandles?.twitter) socialMediaHandles.twitter = body.socialMediaHandles.twitter;
    if (body.socialMediaHandles?.FB) socialMediaHandles.FB = body.socialMediaHandles.FB;

    // Build request object for the database
    const requestData = {
      clerkUserID,
      businessName: body["businessName"],
      businessType: body["businessType"],
      businessOwner: body["businessOwner"],
      website: body["website"],
      physicalAddress: {
        street: body["physicalAddress"]["street"],
        city: body["physicalAddress"]["city"],
        state: body["physicalAddress"]["state"],
        zip: body["physicalAddress"]["zip"],
      },
      mailingAddress: {
        street: body["mailingAddress"]["street"],
        city: body["mailingAddress"]["city"],
        state: body["mailingAddress"]["state"],
        zip: body["mailingAddress"]["zip"],
      },
      pointOfContact: {
        name: body["pointOfContact"]["name"],
        phoneNumber: body["pointOfContact"]["phoneNumber"],
        email: body["pointOfContact"]["email"],
      },
      description: body["description"],
      date: body["date"],
      status: body["status"] ?? "open",
      organizationType: body["organizationType"],
      businessScale: body["businessScale"],
      numberOfEmployees: body["numberOfEmployees"],
      gender: body["gender"],
      decision: null,
    };

    // Add socialMediaHandles only if not empty
    if (Object.keys(socialMediaHandles).length > 0) {
      (requestData as any).socialMediaHandles = socialMediaHandles;
    }

    // Create a new request
    const newRequest = await SignupRequest.create(requestData);

    return NextResponse.json({ message: "Request created successfully", requestId: newRequest._id }, { status: 201 });
  } catch (err) {
    console.error("Error creating request:", err);
    return NextResponse.json({ message: "Error occurred", error: err }, { status: 500 });
  }
}
