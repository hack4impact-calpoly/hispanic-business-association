import connectDB from "@/database/db";
import { NextRequest, NextResponse } from "next/server";
import requestSchema from "@/database/requestSchema";
import { currentUser } from "@clerk/nextjs/server";

// Handles POST requests
export async function POST(req: NextRequest) {
  const body = await req.json();

  // Returns 400 if body is missing
  if (body == null) {
    return NextResponse.json({ message: "Request is empty" }, { status: 400 });
  }

  try {
    // Retrieves current user from Clerk
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
      const existingRequest = await requestSchema.findById(requestId);

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

      // Update the existing request
      const updatedRequest = await requestSchema.findByIdAndUpdate(
        requestId,
        {
          // Only update fields provided in the request body
          ...(body.businessName !== undefined && { businessName: body.businessName }),
          ...(body.businessType !== undefined && { businessType: body.businessType }),
          ...(body.businessOwner !== undefined && { businessOwner: body.businessOwner }),
          ...(body.website !== undefined && { website: body.website }),
          ...(body.description !== undefined && { description: body.description }),
          ...(body.logoUrl !== undefined && { logoUrl: body.logoUrl }),
          ...(body.bannerUrl !== undefined && { bannerUrl: body.bannerUrl }),

          // Update nested objects if provided
          ...(body.address && {
            address: {
              ...(existingRequest.address || {}),
              ...(body.address.street !== undefined && { street: body.address.street }),
              ...(body.address.city !== undefined && { city: body.address.city }),
              ...(body.address.state !== undefined && { state: body.address.state }),
              ...(body.address.zip !== undefined && { zip: body.address.zip }),
              ...(body.address.county !== undefined && { county: body.address.county }),
            },
          }),
          ...(body.pointOfContact && {
            pointOfContact: {
              ...(existingRequest.pointOfContact || {}),
              ...(body.pointOfContact.name !== undefined && { name: body.pointOfContact.name }),
              ...(body.pointOfContact.phoneNumber !== undefined && { phoneNumber: body.pointOfContact.phoneNumber }),
              ...(body.pointOfContact.email !== undefined && { email: body.pointOfContact.email }),
            },
          }),
          ...(body.socialMediaHandles && {
            socialMediaHandles: {
              ...(existingRequest.socialMediaHandles || {}),
              ...(body.socialMediaHandles.IG !== undefined && { IG: body.socialMediaHandles.IG }),
              ...(body.socialMediaHandles.twitter !== undefined && { twitter: body.socialMediaHandles.twitter }),
              ...(body.socialMediaHandles.FB !== undefined && { FB: body.socialMediaHandles.FB }),
            },
          }),

          // Update date
          date: body.date || new Date().toISOString(),
        },
        { new: true }, // Return the updated document
      );

      return NextResponse.json(
        { message: "Request updated successfully", requestId: updatedRequest._id },
        { status: 200 },
      );
    } else {
      // Check if there's an existing open request from this user
      const existingOpenRequest = await requestSchema.findOne({
        clerkUserID: clerkUserID,
        status: "open",
      });

      // If an open request exists, update it instead of creating a new one
      if (existingOpenRequest) {
        const updatedRequest = await requestSchema.findByIdAndUpdate(
          existingOpenRequest._id,
          {
            // Only update fields provided in the request body
            ...(body.businessName !== undefined && { businessName: body.businessName }),
            ...(body.businessType !== undefined && { businessType: body.businessType }),
            ...(body.businessOwner !== undefined && { businessOwner: body.businessOwner }),
            ...(body.website !== undefined && { website: body.website }),
            ...(body.description !== undefined && { description: body.description }),
            ...(body.logoUrl !== undefined && { logoUrl: body.logoUrl }),
            ...(body.bannerUrl !== undefined && { bannerUrl: body.bannerUrl }),

            // Update nested objects if provided
            ...(body.address && {
              address: {
                ...(existingOpenRequest.address || {}),
                ...(body.address.street !== undefined && { street: body.address.street }),
                ...(body.address.city !== undefined && { city: body.address.city }),
                ...(body.address.state !== undefined && { state: body.address.state }),
                ...(body.address.zip !== undefined && { zip: body.address.zip }),
                ...(body.address.county !== undefined && { county: body.address.county }),
              },
            }),
            ...(body.pointOfContact && {
              pointOfContact: {
                ...(existingOpenRequest.pointOfContact || {}),
                ...(body.pointOfContact.name !== undefined && { name: body.pointOfContact.name }),
                ...(body.pointOfContact.phoneNumber !== undefined && { phoneNumber: body.pointOfContact.phoneNumber }),
                ...(body.pointOfContact.email !== undefined && { email: body.pointOfContact.email }),
              },
            }),
            ...(body.socialMediaHandles && {
              socialMediaHandles: {
                ...(existingOpenRequest.socialMediaHandles || {}),
                ...(body.socialMediaHandles.IG !== undefined && { IG: body.socialMediaHandles.IG }),
                ...(body.socialMediaHandles.twitter !== undefined && { twitter: body.socialMediaHandles.twitter }),
                ...(body.socialMediaHandles.FB !== undefined && { FB: body.socialMediaHandles.FB }),
              },
            }),

            // Update date
            date: body.date || new Date().toISOString(),
          },
          { new: true }, // Return the updated document
        );

        return NextResponse.json(
          { message: "Existing request updated", requestId: updatedRequest._id },
          { status: 200 },
        );
      }

      // Builds request object for database
      const requestData = {
        clerkUserID,
        // Original business information
        originalDescription: body["originalDescription"],
        // Updated fields
        businessName: body["businessName"],
        businessType: body["businessType"],
        businessOwner: body["businessOwner"],
        website: body["website"],
        address: body["address"]
          ? {
              street: body["address"]["street"],
              city: body["address"]["city"],
              state: body["address"]["state"],
              zip: body["address"]["zip"],
              county: body["address"]["county"],
            }
          : undefined,
        pointOfContact: body["pointOfContact"]
          ? {
              name: body["pointOfContact"]["name"],
              phoneNumber: body["pointOfContact"]["phoneNumber"],
              email: body["pointOfContact"]["email"],
            }
          : undefined,
        socialMediaHandles: body["socialMediaHandles"]
          ? {
              IG: body["socialMediaHandles"]["IG"],
              twitter: body["socialMediaHandles"]["twitter"],
              FB: body["socialMediaHandles"]["FB"],
            }
          : undefined,
        description: body["description"],
        // Image URLs if provided
        logoUrl: body["logoUrl"],
        bannerUrl: body["bannerUrl"],
        // Timestamps
        date: body["date"] || new Date().toISOString(),
        requestType: "update",
        // Status fields
        status: "open",
        decision: null,
      };

      // Create new request
      const newRequest = await requestSchema.collection.insertOne(requestData);

      return NextResponse.json(
        { message: "Request created successfully", requestId: newRequest.insertedId },
        { status: 201 },
      );
    }
  } catch (err) {
    // Logs error, returns 500 status
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
  const dbRequests = await requestSchema.find(query).sort({ date: -1 });
  if (!dbRequests) {
    return NextResponse.json({ message: "Requests not found" }, { status: 404 });
  }

  // Returns requests in JSON response
  return NextResponse.json(dbRequests, { status: 200 });
}
