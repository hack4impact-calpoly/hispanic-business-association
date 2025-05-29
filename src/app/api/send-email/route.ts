import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs/promises"; // Use fs/promises for async file operations

// Important: disable built-in body parsing
// This is still crucial because Next.js would try to parse it as JSON or text otherwise.
// We want to access the raw FormData directly.
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export const dynamic = "force-dynamic";
export const maxDuration = 60;
export const preferredRegion = "auto";

// Define a type for your attachment objects
interface EmailAttachment {
  filename: string;
  path: string; // The path to the temporary file
}

export async function POST(req: NextRequest) {
  try {
    console.log("Received POST request for /api/send-email");

    // 1. Get FormData directly from the NextRequest object
    const formData = await req.formData();

    // 2. Extract fields
    const toAddressesRaw = formData.get("toAddresses") as string;
    const subject = formData.get("subject") as string;
    const body = formData.get("body") as string;
    // const businessType = formData.get("businessType") as string; // if you need this on server

    let toAddresses: string[] = [];
    try {
      toAddresses = JSON.parse(toAddressesRaw ?? "[]");
      if (!Array.isArray(toAddresses)) {
        throw new Error("toAddresses is not an array after JSON.parse.");
      }
    } catch (parseError) {
      console.error("Error parsing toAddresses:", parseError);
      return NextResponse.json({ error: "Invalid 'toAddresses' format." }, { status: 400 });
    }

    // 3. Handle attachment(s)
    const attachmentFile = formData.get("attachment") as File | null;
    const attachments: EmailAttachment[] = [];

    if (attachmentFile) {
      // Check if it's actually a File object (not null and has blob properties)
      if (attachmentFile instanceof File) {
        // Read the file content into a Buffer
        const arrayBuffer = await attachmentFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Create a temporary file path
        // Using a unique name is good practice
        const tempFileName = `${Date.now()}-${attachmentFile.name}`;
        const tempFilePath = `/tmp/${tempFileName}`; // For Vercel/Linux, /tmp is writable
        // For local development, you might need a local 'tmp' folder

        // Ensure the /tmp directory exists (or your chosen temp directory)
        // This is important if you're running locally and don't have /tmp
        // On Vercel, /tmp is always available and writable
        try {
          await fs.mkdir("/tmp", { recursive: true });
        } catch (dirErr) {
          // Ignore error if directory already exists
          if ((dirErr as NodeJS.ErrnoException).code !== "EEXIST") {
            console.error("Failed to create /tmp directory:", dirErr);
            // Decide how to handle this critical error
          }
        }

        // Write the buffer to a temporary file
        await fs.writeFile(tempFilePath, buffer);

        console.log(`Saved temporary file: ${tempFilePath}`);

        attachments.push({
          filename: attachmentFile.name,
          path: tempFilePath,
        });
      } else {
        console.warn("Attachment received but was not a File object:", attachmentFile);
      }
    }

    if (attachments.length > 0) {
      console.log("Attachments to be sent:", attachments);
    } else {
      console.log("No attachments found.");
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

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

    // --- Clean up temporary files after sending emails ---
    for (const attachment of attachments) {
      try {
        if (
          await fs
            .access(attachment.path)
            .then(() => true)
            .catch(() => false)
        ) {
          // Check if file exists
          await fs.unlink(attachment.path);
          console.log(`Deleted temporary file: ${attachment.path}`);
        }
      } catch (err) {
        console.error(`Failed to delete temporary file ${attachment.path}:`, err);
      }
    }

    return NextResponse.json({
      message: `Successfully attempted to send emails to ${results.length} recipients.`,
      results,
    });
  } catch (error) {
    console.error("Email send error:", error);
    let errorMessage = "Failed to send email.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
  }
}
