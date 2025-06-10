// app/pending-account/page.tsx (or adjust path as needed)
"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function PendingBusinessPage() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl mb-4">⏳</div>
      <h1 className="text-2xl font-semibold mb-2">Your account is under review</h1>
      <p className="text-gray-600 mb-6 max-w-md">
        Thanks for signing up! Our team is reviewing your business application. You’ll get access once it’s approved.
      </p>
      <button
        onClick={() => signOut(() => router.push("/"))}
        className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
      >
        Sign out
      </button>
    </div>
  );
}
