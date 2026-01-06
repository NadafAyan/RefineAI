"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Sparkles,
    History,
    BookmarkPlus,
    Settings,
    Menu,
    X,
    LogOut,
} from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const { user, signOut } = useAuth();

    const navigation = [
        { name: "New Prompt", href: "/dashboard", icon: Sparkles },
        { name: "History", href: "/dashboard/history", icon: History },
        { name: "Saved Templates", href: "/dashboard/templates", icon: BookmarkPlus },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ];

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-slate-900/50 border-r border-slate-800 backdrop-blur-xl z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-slate-800">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                RefineAI
                            </h1>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden text-slate-400 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                            ? "bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-purple-500/50 shadow-lg shadow-purple-500/20"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile */}
                    <div className="p-4 border-t border-slate-800">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
                            <Avatar className="w-10 h-10">
                                <AvatarImage src={user?.photoURL || undefined} />
                                <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                                    {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {user?.displayName || "User"}
                                </p>
                                <p className="text-xs text-slate-400 truncate">
                                    {user?.email}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleSignOut}
                                className="text-slate-400 hover:text-white hover:bg-slate-700"
                            >
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Mobile header */}
                <header className="lg:hidden sticky top-0 z-30 bg-slate-900/50 border-b border-slate-800 backdrop-blur-xl">
                    <div className="flex items-center justify-between p-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="text-slate-400 hover:text-white"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            RefineAI
                        </h1>
                        <div className="w-6" /> {/* Spacer for centering */}
                    </div>
                </header>

                {/* Page content */}
                <main className="min-h-screen">
                    <div className="max-w-7xl mx-auto p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
