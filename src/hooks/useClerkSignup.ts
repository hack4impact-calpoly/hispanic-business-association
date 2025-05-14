// hooks/useClerkSignup.ts
import { useSignUp } from "@clerk/nextjs";
import { useState } from "react";

export function useClerkSignup() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [error, setError] = useState("");

  const startSignup = async (email: string, password: string) => {
    if (!isLoaded || !signUp) return "not_loaded";
    try {
      const res = await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId });
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
    if (!isLoaded || !signUp || !setActive) return false;
    try {
      const res = await signUp.attemptEmailAddressVerification({ code });
      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId });
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
