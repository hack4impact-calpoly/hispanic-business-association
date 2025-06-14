export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import connectDB from "@/database/db";
import SentMessage from "@/database/sendMessage";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const { subject, body, attachments, recipient } = data;

    if (!subject || !body || !recipient) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    await connectDB();

    await SentMessage.create({
      subject,
      body,
      attachments,
      recipient,
    });

    return NextResponse.json({ message: "Message stored successfully" });
  } catch (error) {
    console.error("Error storing message:", error);
    return NextResponse.json({ message: "Failed to store message" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const messages = await SentMessage.find().sort({ createdAt: -1 });
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ message: "Failed to fetch messages" }, { status: 500 });
  }
}
