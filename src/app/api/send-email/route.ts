import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs/promises"; // Use fs/promises for async file operations

export const dynamic = "force-dynamic";
export const maxDuration = 60;
export const preferredRegion = "auto";

interface EmailAttachment {
  filename: string;
  path: string;
}

export async function POST(req: NextRequest) {
  try {
    console.log("Received POST request for /api/send-email");

    const formData = await req.formData();

    const toAddressesRaw = formData.get("toAddresses") as string;
    const subject = formData.get("subject") as string;
    const body = formData.get("body") as string;

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

    // 🔁 NEW: Handle multiple attachments like attachment0, attachment1, etc.
    const attachments: EmailAttachment[] = [];
    const entries = Array.from(formData.entries()).filter(([key]) => key.startsWith("attachment"));

    for (const [_, value] of entries) {
      const file = value as File;
      if (!(file instanceof File)) continue;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const tempFileName = `${Date.now()}-${file.name}`;
      const tempFilePath = `/tmp/${tempFileName}`;

      try {
        await fs.mkdir("/tmp", { recursive: true });
        await fs.writeFile(tempFilePath, buffer);

        attachments.push({
          filename: file.name,
          path: tempFilePath,
        });

        console.log(`Saved temporary file: ${tempFilePath}`);
      } catch (err) {
        console.error(`Error handling attachment ${file.name}:`, err);
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

    for (const attachment of attachments) {
      try {
        if (
          await fs
            .access(attachment.path)
            .then(() => true)
            .catch(() => false)
        ) {
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
