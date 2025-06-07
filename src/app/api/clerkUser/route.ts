import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  try {
    const clerk = await clerkClient();
    const user = await clerk.users.createUser({
      emailAddress: [email],
      password: password,
    });
    return Response.json({ message: "User created", user });
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return Response.json({ error: errorMessage });
  }
}
