import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div>
      <img src="public/logo/HBA_NoBack_NoWords.png" />
      <SignIn />
    </div>
  );
}
