import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
export default function Login() {
    const [, setLocation] = useLocation();
    const [mode, setMode] = useState("signin");
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { signIn, signUp } = useAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { email, password } = form;
        try {
            const { session } = mode === "signin"
                ? await signIn(email, password)
                : await signUp(email, password);
            if (!session) {
                if (mode === "signup") {
                    setError("Check your email for a confirmation link");
                }
            }
            else {
                setLocation("/");
            }
        }
        catch (authError) {
            setError(authError.message);
        }
        finally {
            setLoading(false);
        }
    };
    const signInOAuth = async (provider) => {
        const redirectTo = window.location.origin;
        await supabase.auth.signInWithOAuth({
            provider,
            options: { redirectTo },
        });
    };
    return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-space", children: _jsxs("form", { onSubmit: handleSubmit, className: "w-full max-w-sm space-y-4 p-6 card-rare rounded-lg bg-gradient-to-br from-void to-purple-deep text-white", children: [_jsx("h2", { className: "text-xl font-semibold text-center", children: mode === "signin" ? "Sign In" : "Sign Up" }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "email", children: "Email" }), _jsx(Input, { id: "email", type: "email", value: form.email, onChange: (e) => setForm({ ...form, email: e.target.value }), required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "password", children: "Password" }), _jsx(Input, { id: "password", type: "password", value: form.password, onChange: (e) => setForm({ ...form, password: e.target.value }), required: true })] }), error && _jsx("p", { className: "text-sm text-red-400", children: error }), _jsx(Button, { type: "submit", className: "w-full", disabled: loading, children: loading ? "Loading..." : mode === "signin" ? "Sign In" : "Sign Up" }), _jsx("div", { className: "flex justify-center", children: _jsx("button", { type: "button", className: "text-xs text-neon-cyan", onClick: () => setMode(mode === "signin" ? "signup" : "signin"), children: mode === "signin"
                            ? "Need an account? Sign up"
                            : "Have an account? Sign in" }) }), _jsxs("div", { className: "space-y-2 pt-4", children: [_jsx(Button, { type: "button", className: "w-full", onClick: () => signInOAuth("google"), children: "Continue with Google" }), _jsx(Button, { type: "button", className: "w-full", onClick: () => signInOAuth("github"), children: "Continue with GitHub" })] })] }) }));
}
