import { useSignUp } from "@clerk/nextjs";
import { useState } from "react";

export function useClerkSignup() {
  const { isLoaded, signUp } = useSignUp();
  const [error, setError] = useState("");

  const startSignup = async (email: string, password: string) => {
    if (!isLoaded || !signUp) return "not_loaded";
    try {
      const res = await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      if (res.status === "complete") {
        return "verified";
      }

      return "needs_verification";
    } catch (e: any) {
      const msg = e?.errors?.[0]?.message || "Signup failed";
      setError(msg);
      return "error";
    }
  };

  const verifyCode = async (code: string, postSignupCallback?: (userId: string) => void) => {
    if (!isLoaded || !signUp) return false;

    try {
      const res = await signUp.attemptEmailAddressVerification({ code });

      if (res.status === "complete") {
        // Set role metadata for future login
        await fetch("/api/set-role", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: res.createdUserId,
            role: "business",
          }),
        });

        // Execute callback with user ID for signup request creation
        postSignupCallback?.(res.createdUserId || "");
        return true;
      }

      setError("Verification incomplete");
      return false;
    } catch (err: any) {
      const msg = err?.errors?.[0]?.message || "Verification failed";
      setError(msg);
      return false;
    }
  };

  return {
    startSignup,
    verifyCode,
    error,
  };
}
