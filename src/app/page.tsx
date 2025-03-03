"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useSignIn, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Login() {
  const [formData, setFormData] = useState<{ username: string; password: string }>({
    username: "",
    password: "",
  });

  const { signIn, isLoaded } = useSignIn();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const router = useRouter();

  const { signOut } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      // Sign out current session before signing in
      await signOut();

      // Proceed with signing in
      const result = await signIn.create({
        identifier: formData.username,
        password: formData.password,
      });

      console.log("User signed in successfully:", result);
      router.push("/business"); // Redirect user after login
    } catch (error) {
      console.error("Error signing in:", JSON.stringify(error, null, 2));
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="flex justify-center mb-6">
            <Image src="/logo/HBA_No_Back.png" alt="HBA Logo" width={122} height={122} />
            {/* Replace with your logo */}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </a>{" "}
            |
            <a href="/help" className="text-blue-600 hover:underline ml-1">
              Need help?
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
