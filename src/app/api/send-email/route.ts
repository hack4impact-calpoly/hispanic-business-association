import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";
import { currentUser } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;
export const preferredRegion = "auto";

// Define attachment interface
interface EmailAttachment {
  filename: string;
  path: string;
}

// Cleanup temporary files to prevent disk space leaks
async function cleanupAttachments(attachments: EmailAttachment[]): Promise<void> {
  for (const attachment of attachments) {
    try {
      if (
        await fs
          .access(attachment.path)
          .then(() => true)
          .catch(() => false)
      ) {
        await fs.unlink(attachment.path);
      }
    } catch (err) {
      // Continue processing so that cleanup errors don't interrupt operations
    }
  }
}

export async function POST(req: NextRequest) {
  const attachments: EmailAttachment[] = [];

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

    // Get FormData from request
    const formData = await req.formData();

    // Extract required fields
    const toAddressesRaw = formData.get("toAddresses") as string;
    const subject = formData.get("subject") as string;
    const body = formData.get("body") as string;

    // Validate required fields
    if (!toAddressesRaw || !subject || !body) {
      return NextResponse.json({ error: "Missing required fields: toAddresses, subject, or body" }, { status: 400 });
    }

    // Parse and validate toAddresses
    let toAddresses: string[] = [];
    try {
      toAddresses = JSON.parse(toAddressesRaw);
      if (!Array.isArray(toAddresses)) {
        throw new Error("toAddresses is not an array after JSON.parse.");
      }
    } catch (parseError) {
      return NextResponse.json({ error: "Invalid 'toAddresses' format." }, { status: 400 });
    }

    // Handle attachments
    const attachmentFiles = formData.getAll("attachment") as File[];

    if (attachmentFiles.length > 0) {
      try {
        // Ensure temp directory exists
        await fs.mkdir("/tmp", { recursive: true });
      } catch (dirErr) {
        // Handle directory creation error
        if ((dirErr as NodeJS.ErrnoException).code !== "EEXIST") {
          return NextResponse.json({ error: "Failed to create temporary directory" }, { status: 500 });
        }
      }

      // Process each attachment file
      for (const attachmentFile of attachmentFiles) {
        if (attachmentFile instanceof File && attachmentFile.size > 0) {
          try {
            // Read file content into Buffer
            const arrayBuffer = await attachmentFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Sanitize filename to prevent directory traversal attacks
            const sanitizedName = path.basename(attachmentFile.name);

            // Create unique temporary file path that prevents collisions
            const tempFileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${sanitizedName}`;
            const tempFilePath = `/tmp/${tempFileName}`;

            // Write buffer to temporary file
            await fs.writeFile(tempFilePath, buffer);

            attachments.push({
              filename: attachmentFile.name,
              path: tempFilePath,
            });
          } catch (fileError) {
            return NextResponse.json({ error: "Failed to process attachment" }, { status: 500 });
          }
        }
      }
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send emails to each recipient
    const sendPromises = toAddresses.map((to: string) =>
      transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL,
        to,
        subject,
        text: body,
        attachments,
      }),
    );

    const results = await Promise.all(sendPromises);

    return NextResponse.json({
      message: `Successfully attempted to send emails to ${results.length} recipients.`,
      results,
    });
  } catch (error) {
    let errorMessage = "Failed to send email.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
  } finally {
    // Always clean up temporary files so that disk space doesn't leak
    await cleanupAttachments(attachments);
  }
}
