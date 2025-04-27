"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  // Step state
  const [codeSent, setCodeSent] = useState(false);

  // Form fields
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");

  // Field-specific error states
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("Email is required");
  const [codeError, setCodeError] = useState(false);
  const [codeErrorMessage, setCodeErrorMessage] = useState("Code is required");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("Password is required");

  // Form state
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [resetProgress, setResetProgress] = useState(false);

  // Hooks
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();

  // Handle sending reset code
  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    // Clear old errors
    setEmailError(false);
    setEmailErrorMessage("Email is required");

    if (!isLoaded || !signIn) {
      setEmailError(true);
      setEmailErrorMessage("Authentication service not ready. Please try again.");
      return;
    }

    if (!email) {
      setEmailError(true);
      return;
    }

    setResetProgress(true);

    try {
      // Start reset password flow with email code
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });

      setCodeSent(true);
      setSubmitAttempted(false); // Reset for the next form
    } catch (err: any) {
      // Handle Clerk errors
      if (err.errors && err.errors[0]) {
        setEmailError(true);
        setEmailErrorMessage(err.errors[0].message || "Failed to send reset code");
      } else {
        setEmailError(true);
        setEmailErrorMessage("An unexpected error occurred");
      }
    } finally {
      setResetProgress(false);
    }
  };

  // Handle verifying code and setting new password
  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    // Clear old errors
    setCodeError(false);
    setPasswordError(false);
    setCodeErrorMessage("Code is required");
    setPasswordErrorMessage("Password is required");

    if (!isLoaded || !signIn || !setActive) {
      setCodeError(true);
      setCodeErrorMessage("Authentication service not ready. Please try again.");
      return;
    }

    if (!code) {
      setCodeError(true);
      return;
    }

    if (!password) {
      setPasswordError(true);
      return;
    }

    setResetProgress(true);

    try {
      // Verify code and set new password
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });

      if (result.status === "complete" && result.createdSessionId) {
        // Activate the new session
        await setActive({ session: result.createdSessionId });

        // Redirect to appropriate dashboard based on user role
        const userRole = (result.userData as any)?.publicMetadata?.role || "business";
        router.push(userRole === "admin" ? "/admin" : "/business");
      }
    } catch (err: any) {
      // Handle Clerk errors
      if (err.errors && err.errors[0]) {
        const error = err.errors[0];

        // Determine which field has the error
        if (error.code === "form_code_incorrect") {
          setCodeError(true);
          setCodeErrorMessage(error.message || "Invalid code");
        } else if (error.code.includes("password")) {
          setPasswordError(true);
          setPasswordErrorMessage(error.message || "Invalid password");
        } else {
          setCodeError(true);
          setCodeErrorMessage(error.message || "Verification failed");
        }
      } else {
        setCodeError(true);
        setCodeErrorMessage("An unexpected error occurred");
      }
    } finally {
      setResetProgress(false);
    }
  };

  // Helper for form error display
  const showError = (fieldValue: string, fieldError: boolean) => {
    return (fieldValue === "" && submitAttempted) || fieldError;
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <Card className="w-full h-screen md:rounded-lg lg:rounded-lg rounded-none lg:max-w-sm md:max-w-md md:h-auto bg-white">
        <CardContent className="p-8 flex flex-col justify-center h-full md:h-auto">
          <div className="flex justify-center mb-6">
            <Image src="/logo/HBA_No_Back.png" alt="HBA Logo" width={122} height={122} />
          </div>

          <h2 className="text-xl font-semibold text-center mb-6">
            {!codeSent ? "Forgot Your Password?" : "Reset Your Password"}
          </h2>

          {!codeSent && (
            <p className="text-center text-sm text-gray-600 mb-6">
              Enter your email address and we&apos;ll send you a code to reset your password.
            </p>
          )}

          {codeSent && (
            <p className="text-center text-sm text-gray-600 mb-6">
              Enter the verification code sent to your email and create a new password.
            </p>
          )}

          {!codeSent ? (
            <form onSubmit={handleSendResetCode} className="space-y-4">
              <div>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={resetProgress}
                  className={showError(email, emailError) ? "border-red-500" : ""}
                />
                {showError(email, emailError) && <p className="mt-1 text-sm text-red-500">{emailErrorMessage}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={resetProgress}>
                {resetProgress ? "Sending..." : "Send Reset Code"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyAndReset} className="space-y-4">
              <div>
                <Input
                  type="text"
                  name="code"
                  placeholder="Verification Code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={resetProgress}
                  className={showError(code, codeError) ? "border-red-500" : ""}
                />
                {showError(code, codeError) && <p className="mt-1 text-sm text-red-500">{codeErrorMessage}</p>}
              </div>

              <div>
                <Input
                  type="password"
                  name="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={resetProgress}
                  className={showError(password, passwordError) ? "border-red-500" : ""}
                />
                {showError(password, passwordError) && (
                  <p className="mt-1 text-sm text-red-500">{passwordErrorMessage}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={resetProgress}>
                {resetProgress ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          )}

          <div className="mt-4 text-center text-sm">
            <a href="/" className="text-blue-600 hover:underline">
              Back to Login
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
