"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Chrome, Mail } from "lucide-react";

export default function LoginPage() {
    const { user, signInWithGoogle, signInWithEmail, loading: authLoading } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Redirect to dashboard if already logged in
    useEffect(() => {
        if (user && !authLoading) {
            router.push("/dashboard");
        }
    }, [user, authLoading, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!formData.email || !formData.password) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            await signInWithEmail(formData.email, formData.password);
            // Redirect happens in useEffect after user state updates
        } catch (err: any) {
            console.error("Login error:", err);
            if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
                setError("Invalid email or password");
            } else if (err.code === "auth/invalid-email") {
                setError("Invalid email address");
            } else if (err.code === "auth/too-many-requests") {
                setError("Too many attempts. Please try again later");
            } else {
                setError("Failed to sign in. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
            // Redirect happens in useEffect after user state updates
        } catch {
            setError("Failed to sign in with Google");
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="text-slate-300 text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-slate-950 to-blue-900/20" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-600/10 via-transparent to-transparent" />

            {/* Login Card */}
            <Card className="relative w-full max-w-md bg-slate-900/50 border-slate-800 backdrop-blur-xl shadow-2xl shadow-purple-500/10">
                <CardHeader className="space-y-3 text-center">
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        Welcome Back
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-base">
                        Sign in to continue refining your AI prompts
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Google Sign In Button */}
                    <Button
                        onClick={handleGoogleSignIn}
                        type="button"
                        size="lg"
                        className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-6 text-base shadow-lg hover:shadow-xl transition-all hover:scale-105"
                    >
                        <Chrome className="w-5 h-5 mr-3" />
                        Sign in with Google
                    </Button>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-slate-900/50 text-slate-500">
                                Or sign in with email
                            </span>
                        </div>
                    </div>

                    {/* Email/Password Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-slate-300">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="pl-10 bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-slate-300">
                                Password
                            </label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500"
                            />
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 text-base font-semibold shadow-lg shadow-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-500/60 hover:scale-105"
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </Button>
                    </form>

                    {/* Sign Up Link */}
                    <p className="text-center text-sm text-slate-400">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-medium">
                            Sign up
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
