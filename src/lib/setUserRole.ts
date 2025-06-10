import { clerkClient } from "@clerk/nextjs/server";

export async function setUserRole(userId: string, role: string) {
  const client = await clerkClient();
  await client.users.updateUser(userId, {
    publicMetadata: { role },
  });
}
