import connectDB from "@/database/db";
import { NextRequest, NextResponse } from "next/server";
import Request from "@/database/requestSchema";
import Business from "@/database/businessSchema";
import { currentUser } from "@clerk/nextjs/server";

// Handles POST requests
export async function POST(req: NextRequest) {
  const body = await req.json();

  // Returns 400 if body is missing
  if (body == null) {
    return NextResponse.json({ message: "Request is empty" }, { status: 400 });
  }

  try {
    // Retrieve current user from Clerk
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Get the clerkUserID from the body or use the current user's ID
    const clerkUserID = body["clerkUserID"] || user.id;

    // Get request ID if provided (for updates)
    const requestId = body["requestId"] || null;

    // Check if we're updating an existing request
    if (requestId) {
      // Find the existing request
      const existingRequest = await Request.findById(requestId);

      if (!existingRequest) {
        return NextResponse.json({ message: "Request not found" }, { status: 404 });
      }

      // Verify user owns this request
      if (existingRequest.clerkUserID !== clerkUserID) {
        return NextResponse.json({ message: "Not authorized to update this request" }, { status: 403 });
      }

      // Verify request is still open
      if (existingRequest.status === "closed") {
        return NextResponse.json({ message: "Cannot update a closed request" }, { status: 400 });
      }

      // Start with the existing "new" data instead of current business data
      let updatedNewData = { ...existingRequest.new };

      // Update specific fields from the request body
      if (body.businessName !== undefined) updatedNewData.businessName = body.businessName;
      if (body.businessType !== undefined) updatedNewData.businessType = body.businessType;
      if (body.businessOwner !== undefined) updatedNewData.businessOwner = body.businessOwner;
      if (body.website !== undefined) updatedNewData.website = body.website;
      if (body.description !== undefined) updatedNewData.description = body.description;
      if (body.logoUrl !== undefined) updatedNewData.logoUrl = body.logoUrl;
      if (body.bannerUrl !== undefined) updatedNewData.bannerUrl = body.bannerUrl;

      // Handle nested objects if provided
      if (body.address) {
        updatedNewData.address = updatedNewData.address || {};
        if (body.address.street !== undefined) updatedNewData.address.street = body.address.street;
        if (body.address.city !== undefined) updatedNewData.address.city = body.address.city;
        if (body.address.state !== undefined) updatedNewData.address.state = body.address.state;
        if (body.address.zip !== undefined) updatedNewData.address.zip = body.address.zip;
        if (body.address.county !== undefined) updatedNewData.address.county = body.address.county;
      }

      if (body.pointOfContact) {
        updatedNewData.pointOfContact = updatedNewData.pointOfContact || {};
        if (body.pointOfContact.name !== undefined) updatedNewData.pointOfContact.name = body.pointOfContact.name;
        if (body.pointOfContact.phoneNumber !== undefined)
          updatedNewData.pointOfContact.phoneNumber = body.pointOfContact.phoneNumber;
        if (body.pointOfContact.email !== undefined) updatedNewData.pointOfContact.email = body.pointOfContact.email;
      }

      if (body.socialMediaHandles) {
        updatedNewData.socialMediaHandles = updatedNewData.socialMediaHandles || {};
        if (body.socialMediaHandles.IG !== undefined) updatedNewData.socialMediaHandles.IG = body.socialMediaHandles.IG;
        if (body.socialMediaHandles.twitter !== undefined)
          updatedNewData.socialMediaHandles.twitter = body.socialMediaHandles.twitter;
        if (body.socialMediaHandles.FB !== undefined) updatedNewData.socialMediaHandles.FB = body.socialMediaHandles.FB;
      }

      // Update the existing request with merged changes
      const updatedRequest = await Request.findByIdAndUpdate(
        requestId,
        {
          new: updatedNewData,
          date: body["date"] || new Date().toISOString(),
        },
        { new: true },
      );

      return NextResponse.json(
        { message: "Request updated successfully", requestId: updatedRequest._id },
        { status: 200 },
      );
    } else {
      // If no requestId provided, this is a new request or we're handling an existing open request

      // Fetch current business data for 'old' state
      const business = await Business.findOne({ clerkUserID });
      if (!business) {
        return NextResponse.json({ message: "Business not found" }, { status: 404 });
      }

      // Extract current business data for old state
      const oldData = {
        businessName: business.businessName,
        businessType: business.businessType,
        businessOwner: business.businessOwner,
        website: business.website,
        address: business.address,
        pointOfContact: business.pointOfContact,
        socialMediaHandles: business.socialMediaHandles,
        description: business.description,
        logoUrl: business.logoUrl,
        bannerUrl: business.bannerUrl,
      };

      // Initialize new data with old data (for fields not being updated)
      const newData = { ...oldData };

      // Update any fields provided in the request body
      if (body.businessName !== undefined) newData.businessName = body.businessName;
      if (body.businessType !== undefined) newData.businessType = body.businessType;
      if (body.businessOwner !== undefined) newData.businessOwner = body.businessOwner;
      if (body.website !== undefined) newData.website = body.website;
      if (body.description !== undefined) newData.description = body.description;
      if (body.logoUrl !== undefined) newData.logoUrl = body.logoUrl;
      if (body.bannerUrl !== undefined) newData.bannerUrl = body.bannerUrl;

      // Handle nested objects if provided
      if (body.address) {
        newData.address = { ...oldData.address };
        if (body.address.street !== undefined) newData.address.street = body.address.street;
        if (body.address.city !== undefined) newData.address.city = body.address.city;
        if (body.address.state !== undefined) newData.address.state = body.address.state;
        if (body.address.zip !== undefined) newData.address.zip = body.address.zip;
        if (body.address.county !== undefined) newData.address.county = body.address.county;
      }

      if (body.pointOfContact) {
        newData.pointOfContact = { ...oldData.pointOfContact };
        if (body.pointOfContact.name !== undefined) newData.pointOfContact.name = body.pointOfContact.name;
        if (body.pointOfContact.phoneNumber !== undefined)
          newData.pointOfContact.phoneNumber = body.pointOfContact.phoneNumber;
        if (body.pointOfContact.email !== undefined) newData.pointOfContact.email = body.pointOfContact.email;
      }

      if (body.socialMediaHandles) {
        newData.socialMediaHandles = { ...oldData.socialMediaHandles };
        if (body.socialMediaHandles.IG !== undefined) newData.socialMediaHandles.IG = body.socialMediaHandles.IG;
        if (body.socialMediaHandles.twitter !== undefined)
          newData.socialMediaHandles.twitter = body.socialMediaHandles.twitter;
        if (body.socialMediaHandles.FB !== undefined) newData.socialMediaHandles.FB = body.socialMediaHandles.FB;
      }

      // Check if there's an existing open request from this user
      const existingOpenRequest = await Request.findOne({
        clerkUserID: clerkUserID,
        status: "open",
      });

      // If an open request exists, update it instead of creating a new one
      if (existingOpenRequest) {
        // Start with the existing "new" data
        let updatedNewData = { ...existingOpenRequest.new };

        // Update specific fields from the request body
        if (body.businessName !== undefined) updatedNewData.businessName = body.businessName;
        if (body.businessType !== undefined) updatedNewData.businessType = body.businessType;
        if (body.businessOwner !== undefined) updatedNewData.businessOwner = body.businessOwner;
        if (body.website !== undefined) updatedNewData.website = body.website;
        if (body.description !== undefined) updatedNewData.description = body.description;
        if (body.logoUrl !== undefined) updatedNewData.logoUrl = body.logoUrl;
        if (body.bannerUrl !== undefined) updatedNewData.bannerUrl = body.bannerUrl;

        // Handle nested objects if provided
        if (body.address) {
          updatedNewData.address = updatedNewData.address || {};
          if (body.address.street !== undefined) updatedNewData.address.street = body.address.street;
          if (body.address.city !== undefined) updatedNewData.address.city = body.address.city;
          if (body.address.state !== undefined) updatedNewData.address.state = body.address.state;
          if (body.address.zip !== undefined) updatedNewData.address.zip = body.address.zip;
          if (body.address.county !== undefined) updatedNewData.address.county = body.address.county;
        }

        if (body.pointOfContact) {
          updatedNewData.pointOfContact = updatedNewData.pointOfContact || {};
          if (body.pointOfContact.name !== undefined) updatedNewData.pointOfContact.name = body.pointOfContact.name;
          if (body.pointOfContact.phoneNumber !== undefined)
            updatedNewData.pointOfContact.phoneNumber = body.pointOfContact.phoneNumber;
          if (body.pointOfContact.email !== undefined) updatedNewData.pointOfContact.email = body.pointOfContact.email;
        }

        if (body.socialMediaHandles) {
          updatedNewData.socialMediaHandles = updatedNewData.socialMediaHandles || {};
          if (body.socialMediaHandles.IG !== undefined)
            updatedNewData.socialMediaHandles.IG = body.socialMediaHandles.IG;
          if (body.socialMediaHandles.twitter !== undefined)
            updatedNewData.socialMediaHandles.twitter = body.socialMediaHandles.twitter;
          if (body.socialMediaHandles.FB !== undefined)
            updatedNewData.socialMediaHandles.FB = body.socialMediaHandles.FB;
        }

        const updatedRequest = await Request.findByIdAndUpdate(
          existingOpenRequest._id,
          {
            new: updatedNewData,
            date: body["date"] || new Date().toISOString(),
          },
          { new: true },
        );

        return NextResponse.json(
          { message: "Existing request updated", requestId: updatedRequest._id },
          { status: 200 },
        );
      }

      // Create new request
      const requestData = {
        clerkUserID,
        old: oldData,
        new: newData,
        date: body["date"] || new Date().toISOString(),
        status: "open",
        decision: null,
      };

      const newRequest = await Request.create(requestData);

      return NextResponse.json({ message: "Request created successfully", requestId: newRequest._id }, { status: 201 });
    }
  } catch (err) {
    // Log error, return 500 status
    console.error("Error creating request:", err);
    return NextResponse.json({ message: "Error occurred", error: err }, { status: 500 });
  }
}

// Handles GET requests, returns all requests sorted by recency
export async function GET(req: NextRequest) {
  // Connects to database, verifies user session
  await connectDB();
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ message: "User not logged in" }, { status: 401 });
  }

  // Get query parameters
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  // Build query object
  const query: any = {};

  // Filter by status if provided
  if (status && ["open", "closed"].includes(status)) {
    query.status = status;
  }

  // For non-admin users, only show their own requests
  if (clerkUser.publicMetadata.role !== "admin") {
    query.clerkUserID = clerkUser.id;
  }

  // Queries requests with filters, sorts by date descending
  const dbRequests = await Request.find(query).sort({ date: -1 });
  if (!dbRequests) {
    return NextResponse.json({ message: "Requests not found" }, { status: 404 });
  }

  // Returns requests in JSON response
  return NextResponse.json(dbRequests, { status: 200 });
}
