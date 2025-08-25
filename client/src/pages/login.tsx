import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";

export default function Login() {
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { email, password } = form;
    try {
      const { session } =
        mode === "signin"
          ? await signIn(email, password)
          : await signUp(email, password);
      if (!session) {
        if (mode === "signup") {
          setError("Check your email for a confirmation link");
        }
      } else {
        setLocation("/");
      }
    } catch (authError: any) {
      setError(authError.message);
    } finally {
      setLoading(false);
    }
  };

  const signInOAuth = async (provider: "google" | "github") => {
    const redirectTo = window.location.origin;
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-space">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 p-6 card-rare rounded-lg bg-gradient-to-br from-void to-purple-deep text-white"
      >
        <h2 className="text-xl font-semibold text-center">
          {mode === "signin" ? "Sign In" : "Sign Up"}
        </h2>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Loading..." : mode === "signin" ? "Sign In" : "Sign Up"}
        </Button>
        <div className="flex justify-center">
          <button
            type="button"
            className="text-xs text-neon-cyan"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin"
              ? "Need an account? Sign up"
              : "Have an account? Sign in"}
          </button>
        </div>
        <div className="space-y-2 pt-4">
          <Button
            type="button"
            className="w-full"
            onClick={() => signInOAuth("google")}
          >
            Continue with Google
          </Button>
          <Button
            type="button"
            className="w-full"
            onClick={() => signInOAuth("github")}
          >
            Continue with GitHub
          </Button>
        </div>
      </form>
    </div>
  );
}

