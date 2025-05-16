"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useSignIn, useAuth } from "@clerk/nextjs";
import { useRouter, useParams, usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useContext } from "react";
import { LocaleContext } from "@/app/Providers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

export default function Login() {
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
  // Existing form state
  const [formData, setFormData] = useState<{ username: string; password: string }>({ username: "", password: "" });

  // Add password visibility state
  const [showPassword, setShowPassword] = useState(false);

  // Add field-specific error states
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState("Username is required");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("Password is required");

  // Track submission state
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { signIn, setActive, isLoaded } = useSignIn();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Clear field-specific errors on change
    if (e.target.name === "username") {
      setUsernameError(false);
    } else if (e.target.name === "password") {
      setPasswordError(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const { user, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn && user) {
      const role = user.publicMetadata?.role;
      if (role === "admin") {
        router.replace(`/admin`);
      } else {
        router.replace(`/business`);
      }
    }
  }, [isSignedIn, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    // Reset error states
    setUsernameError(false);
    setPasswordError(false);
    setUsernameErrorMessage("Username is required");
    setPasswordErrorMessage("Password is required");

    // Client-side validation
    if (!formData.username) {
      setUsernameError(true);
      return;
    }

    if (!formData.password) {
      setPasswordError(true);
      return;
    }

    if (!isLoaded) return;

    setIsLoggingIn(true);

    try {
      const result = await signIn.create({ identifier: formData.username, password: formData.password });

      if (result.status === "complete" && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        // Clerk automatically manages the session
        // Redirect logic will be handled in useEffect
      } else {
        console.error("Sign-in not complete:", result);
      }
    } catch (error: any) {
      console.error("Error signing in:", JSON.stringify(error, null, 2));

      // Handle Clerk authentication errors
      if (error.errors && error.errors[0]) {
        const clerkError = error.errors[0];

        // Map error to specific field based on error code/message
        if (
          clerkError.code === "form_identifier_not_found" ||
          clerkError.message.toLowerCase().includes("identifier")
        ) {
          setUsernameError(true);
          setUsernameErrorMessage(clerkError.message || "Invalid username");
        } else if (
          clerkError.code === "form_password_incorrect" ||
          clerkError.message.toLowerCase().includes("password")
        ) {
          setPasswordError(true);
          setPasswordErrorMessage(clerkError.message || "Invalid password");
        } else {
          // General authentication error
          setUsernameError(true);
          setUsernameErrorMessage(clerkError.message || "Authentication failed");
        }
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Helper to show error only after submit attempt or explicit error
  const showError = (fieldValue: string, fieldError: boolean) => {
    return (fieldValue === "" && submitAttempted) || fieldError;
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gray-900">
      <Card className="w-full h-screen md:rounded-lg lg:rounded-lg rounded-none lg:max-w-sm md:max-w-md md:h-auto bg-white">
        <CardContent className="p-8 flex flex-col justify-center h-full md:h-auto">
          <div className="flex justify-center mb-6">
            <Image src="/logo/HBA_No_Back.png" alt="HBA Logo" width={122} height={122} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                name="username"
                placeholder={t("username")}
                value={formData.username}
                onChange={handleChange}
                className={showError(formData.username, usernameError) ? "border-red-500" : ""}
              />
              {showError(formData.username, usernameError) && (
                <p className="mt-1 text-sm text-red-500">{usernameErrorMessage}</p>
              )}
            </div>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={t("password")}
                value={formData.password}
                onChange={handleChange}
                className={showError(formData.password, passwordError) ? "border-red-500" : ""}
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
              {showError(formData.password, passwordError) && (
                <p className="mt-1 text-sm text-red-500">{passwordErrorMessage}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn ? t("loggingIn") : t("login")}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <a href={`/sign-up`} className="text-blue-600 hover:underline">
              {t("signUp")}
            </a>{" "}
            |
            <a href={`/forgot-password`} className="text-blue-600 hover:underline ml-1">
              {t("forgotPwd")}
            </a>
          </div>
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
