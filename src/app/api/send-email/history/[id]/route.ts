import { NextResponse } from "next/server";
import connectDB from "@/database/db";
import SentMessage from "@/database/sendMessage";
import { currentUser } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const message = await SentMessage.findById(params.id);

    if (!message) {
      return NextResponse.json({ message: "Message not found" }, { status: 404 });
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error fetching message:", error);
    return NextResponse.json({ message: "Failed to fetch message" }, { status: 500 });
  }
}
