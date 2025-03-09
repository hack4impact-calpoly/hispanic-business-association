"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useSignIn, useClerk, useAuth } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";

export default function Login() {
  const [formData, setFormData] = useState<{ username: string; password: string }>({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { isLoaded: authLoaded, userId, isSignedIn } = useAuth();
  const clerk = useClerk();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || "/business";

  useEffect(() => {
    if (authLoaded && isSignedIn) {
      setStatus("Already signed in! Redirecting to dashboard...");

      const redirectTimer = setTimeout(() => {
        router.push(redirectUrl);
      }, 1000);

      return () => clearTimeout(redirectTimer);
    }
  }, [authLoaded, isSignedIn, userId, router, redirectUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await clerk.signOut();
      setStatus("Successfully signed out. You can now sign in with another account.");
    } catch (err: any) {
      setError("Failed to sign out. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signInLoaded || !signIn) {
      setError("Authentication system is still initializing. Please try again.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await signIn.create({
        identifier: formData.username,
        password: formData.password,
      });

      if (result.status === "complete") {
        setStatus("Sign-in successful! Redirecting...");

        if (result.createdSessionId) {
          await clerk.setActive({ session: result.createdSessionId });

          setTimeout(() => {
            router.push(redirectUrl);
          }, 1000);
        } else {
          router.push(redirectUrl);
        }
      } else {
        setError(`Authentication not complete. Status: ${result.status}`);
      }
    } catch (error: any) {
      if (error.message && error.message.includes("single session mode")) {
        setError("You're already signed in with another account. Please sign out first.");
      } else {
        setError(error.errors?.[0]?.message || "Login failed. Please check your credentials.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo/HBA_No_Back.png"
              alt="HBA Logo"
              width={122}
              height={122}
              priority
              style={{ height: "auto", width: "auto" }}
            />
          </div>

          {status && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">{status}</div>}

          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

          {(isSignedIn || error?.includes("already signed in")) && (
            <div className="mb-4">
              <Button onClick={handleSignOut} className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
                {isLoading ? "Signing out..." : "Sign out first"}
              </Button>
            </div>
          )}

          {!(isSignedIn && status?.includes("Redirecting")) && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                disabled={isLoading}
                required
                autoComplete="username"
              />
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                required
                autoComplete="current-password"
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Processing..." : "Login"}
              </Button>
            </form>
          )}

          <div className="mt-4 text-center text-sm">
            <a href="/sign-up" className="text-blue-600 hover:underline">
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
