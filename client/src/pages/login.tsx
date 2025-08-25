import { useState } from "react";
import LoginForm from "@/components/forms/login-form";
import SignupForm from "@/components/forms/signup-form";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        {mode === "login" ? (
          <>
            <h2 className="text-center text-xl font-semibold">Log In</h2>
            <LoginForm />
            <p className="text-center text-sm">
              Don't have an account?{" "}
              <Button variant="link" onClick={() => setMode("signup")}>Sign up</Button>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-center text-xl font-semibold">Sign Up</h2>
            <SignupForm />
            <p className="text-center text-sm">
              Already have an account?{" "}
              <Button variant="link" onClick={() => setMode("login")}>Log in</Button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
