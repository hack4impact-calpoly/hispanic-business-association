"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useContext } from "react";
import { LocaleContext } from "@/app/Providers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

export default function ForgotPassword() {
  const t = useTranslations();

  const { locale, setLocale } = useContext(LocaleContext);
  const handleSwitch = (newLocale: string) => {
    if (newLocale === locale) return;
    setLocale(newLocale);
  };
  function getButtonTitle(locale: string) {
    if (locale == "es") {
      return "Español";
    }
    return "English (United States)";
  }

  // Step states
  const [codeSent, setCodeSent] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Form fields
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Field-specific error states
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState(t("emailReq"));
  const [codeError, setCodeError] = useState(false);
  const [codeErrorMessage, setCodeErrorMessage] = useState(t("codeReq"));
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState(t("pwdReq"));

  // Form state
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [resetProgress, setResetProgress] = useState(false);

  // Hooks
  const router = useRouter();
  const { isLoaded, signIn } = useSignIn();

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle sending reset code
  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    // Clear old errors
    setEmailError(false);
    setEmailErrorMessage(t("emailReq"));

    if (!isLoaded || !signIn) {
      setEmailError(true);
      setEmailErrorMessage(t("authNotReady"));
      return;
    }

    if (!email) {
      setEmailError(true);
      return;
    }

    setResetProgress(true);

    try {
      // Start reset password flow with email code
      await signIn.create({ strategy: "reset_password_email_code", identifier: email });

      setCodeSent(true);
      setSubmitAttempted(false); // Reset for the next form
    } catch (err: any) {
      // Handle Clerk errors
      if (err.errors && err.errors[0]) {
        setEmailError(true);
        setEmailErrorMessage(err.errors[0].message || t("noResetCode"));
      } else {
        setEmailError(true);
        setEmailErrorMessage(t("unexpected"));
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
    setCodeErrorMessage(t("codeReq"));
    setPasswordErrorMessage(t("pwdReq"));

    if (!isLoaded || !signIn) {
      setCodeError(true);
      setCodeErrorMessage(t("authNotReady"));
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
      const result = await signIn.attemptFirstFactor({ strategy: "reset_password_email_code", code, password });

      if (result.status === "complete") {
        // Show success message instead of logging in
        setResetSuccess(true);
      }
    } catch (err: any) {
      // Handle Clerk errors
      if (err.errors && err.errors[0]) {
        const error = err.errors[0];

        // Determine which field has the error
        if (error.code === "form_code_incorrect") {
          setCodeError(true);
          setCodeErrorMessage(error.message || t("invalidCode"));
        } else if (error.code.includes("password")) {
          setPasswordError(true);
          setPasswordErrorMessage(error.message || t("invalidPass"));
        } else {
          setCodeError(true);
          setCodeErrorMessage(error.message || t("verifFail"));
        }
      } else {
        setCodeError(true);
        setCodeErrorMessage(t("unexpected"));
      }
    } finally {
      setResetProgress(false);
    }
  };

  // Helper for form error display
  const showError = (fieldValue: string, fieldError: boolean) => {
    return (fieldValue === "" && submitAttempted) || fieldError;
  };

  // Handle back to login button click
  const handleBackToLogin = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gray-900">
      <Card className="w-full h-screen md:rounded-lg lg:rounded-lg rounded-none lg:max-w-sm md:max-w-md md:h-auto bg-white">
        <CardContent className="p-8 flex flex-col justify-center h-full md:h-auto">
          <div className="flex justify-center mb-6">
            <Image src="/logo/HBA_No_Back.png" alt="HBA Logo" width={122} height={122} />
          </div>

          {resetSuccess ? (
            <>
              <h2 className="text-xl font-semibold text-center mb-6">{t("passReset")}</h2>
              <Button onClick={handleBackToLogin} className="w-full">
                {t("backtoLogin")}
              </Button>
            </>
          ) : !codeSent ? (
            <>
              <h2 className="text-xl font-semibold text-center mb-6">{t("forgotPass")}</h2>
              <p className="text-center text-sm text-gray-600 mb-6">{t("forgotPassMsg")}</p>
              <form onSubmit={handleSendResetCode} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    name="email"
                    placeholder={t("email")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={resetProgress}
                    className={showError(email, emailError) ? "border-red-500" : ""}
                  />
                  {showError(email, emailError) && <p className="mt-1 text-sm text-red-500">{emailErrorMessage}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={resetProgress}>
                  {resetProgress ? t("sending") : t("sendReset")}
                </Button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-center mb-6">{t("resetPassword")}</h2>
              <p className="text-center text-sm text-gray-600 mb-6">{t("enterVerif")}</p>
              <form onSubmit={handleVerifyAndReset} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    name="code"
                    placeholder={t("verifCode")}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    disabled={resetProgress}
                    className={showError(code, codeError) ? "border-red-500" : ""}
                  />
                  {showError(code, codeError) && <p className="mt-1 text-sm text-red-500">{codeErrorMessage}</p>}
                </div>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder={t("newPassword")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={resetProgress}
                    className={showError(password, passwordError) ? "border-red-500" : ""}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  {showError(password, passwordError) && (
                    <p className="mt-1 text-sm text-red-500">{passwordErrorMessage}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={resetProgress}>
                  {resetProgress ? t("resetting") : t("resetPasswordButton")}
                </Button>
              </form>
            </>
          )}

          {!resetSuccess && (
            <div className="mt-4 text-center text-sm">
              <a href="/" className="text-blue-600 hover:underline">
                {t("backtoLogin")}
              </a>
            </div>
          )}
          {/* LANGUAGE SWITCH */}
          <div className="md:hidden flex mx-auto mt-[8%]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex border border-gray-300 overflow-hidden text-sm mr-6 mx-auto" type="button">
                  {getButtonTitle(locale)}
                  <Image src="/icons/Sort Down.png" alt="DropDownArrow" width={15} height={15} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleSwitch("en")}>English (United States)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSwitch("es")}>Español</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
      <div className="hidden md:block md:flex md:flex-row md:justify-center mt-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex border border-gray-300 overflow-hidden text-sm mr-6 mx-auto" type="button">
              {getButtonTitle(locale)}
              <Image src="/icons/Sort Down.png" alt="DropDownArrow" width={15} height={15} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleSwitch("en")}>English (United States)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSwitch("es")}>Español</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
