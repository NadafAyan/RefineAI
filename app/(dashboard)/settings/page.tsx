"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/hooks/useSettings";
import { updateProfile } from "firebase/auth";
import { ALL_MODELS } from "@/lib/wizard-data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Download, Trash2, User, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const { settings, loading: settingsLoading, updateSettings, exportUserData, deleteAccount } = useSettings();

    const [displayName, setDisplayName] = useState("");
    const [defaultModel, setDefaultModel] = useState("GPT-4o");
    const [defaultTone, setDefaultTone] = useState(50);

    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingPrefs, setIsSavingPrefs] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    // Load user data
    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || "");
        }
    }, [user]);

    // Load settings data
    useEffect(() => {
        if (settings) {
            setDefaultModel(settings.defaultModel);
            setDefaultTone(settings.defaultTone);
        }
    }, [settings]);

    const handleSaveProfile = async () => {
        if (!user || !displayName.trim()) {
            toast.error("Please enter a valid name");
            return;
        }

        setIsSavingProfile(true);
        try {
            await updateProfile(user, { displayName: displayName.trim() });
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleSavePreferences = async () => {
        setIsSavingPrefs(true);
        try {
            await updateSettings({
                defaultModel,
                defaultTone,
            });
        } catch {
            // Error already handled in hook
        } finally {
            setIsSavingPrefs(false);
        }
    };

    const handleExportData = async () => {
        setIsExporting(true);
        try {
            const data = await exportUserData();
            const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: 'application/json',
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `refineai-data-${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success("Data exported successfully!");
        } catch {
            // Error already handled in hook
        } finally {
            setIsExporting(false);
        }
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            await deleteAccount();
            router.push("/login");
        } catch {
            setIsDeleting(false);
            setShowDeleteDialog(false);
        }
    };

    if (authLoading || settingsLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-slate-400">Loading settings...</div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="space-y-8">
            {/* Enhanced Header with Gradient Background */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/30 via-slate-900/50 to-blue-900/30 border border-purple-500/20 p-8 shadow-xl shadow-purple-500/10">
                {/* Decorative gradient orbs */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl -z-10" />

                <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30">
                        <SettingsIcon className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                            Settings
                        </h1>
                        <p className="text-slate-400 mt-1 text-lg">
                            Customize your experience
                        </p>
                    </div>
                </div>
                <p className="text-slate-300 max-w-2xl leading-relaxed">
                    Manage your profile, configure app preferences, and control your data privacy settings all in one place.
                </p>
            </div>

            <div className="grid gap-6 max-w-4xl">
                {/* Card 1: Profile & Identity */}
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-slate-200">Profile</CardTitle>
                        <CardDescription>Manage your account information</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Avatar */}
                        <div className="flex items-center gap-4">
                            <Avatar className="w-20 h-20">
                                <AvatarImage src={user.photoURL || undefined} alt={displayName} />
                                <AvatarFallback className="text-2xl bg-purple-600">
                                    {displayName?.charAt(0)?.toUpperCase() || <User className="w-8 h-8" />}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-medium text-slate-300">Profile Picture</p>
                                <p className="text-xs text-slate-500">From your Google account</p>
                            </div>
                        </div>

                        {/* Display Name */}
                        <div className="space-y-2">
                            <Label htmlFor="displayName" className="text-slate-300">Display Name</Label>
                            <Input
                                id="displayName"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Enter your name"
                                className="bg-slate-800 border-slate-700 text-slate-200"
                            />
                        </div>

                        {/* Email (Disabled) */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                            <Input
                                id="email"
                                value={user.email || ''}
                                disabled
                                className="bg-slate-800/50 border-slate-700 text-slate-400"
                            />
                            <p className="text-xs text-slate-500">Your email cannot be changed</p>
                        </div>
                    </CardContent>

                    <CardFooter>
                        <Button
                            onClick={handleSaveProfile}
                            disabled={isSavingProfile || !displayName.trim()}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        >
                            {isSavingProfile ? "Saving..." : "Save Changes"}
                        </Button>
                    </CardFooter>
                </Card>

                {/* Card 2: App Preferences */}
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-slate-200">Preferences</CardTitle>
                        <CardDescription>Customize your app experience</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Default Model */}
                        <div className="space-y-3">
                            <Label htmlFor="defaultModel" className="text-slate-300">Default AI Model</Label>
                            <Select value={defaultModel} onValueChange={setDefaultModel}>
                                <SelectTrigger
                                    id="defaultModel"
                                    className="bg-slate-800 border-slate-700 text-slate-200"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700">
                                    {ALL_MODELS.map((model) => (
                                        <SelectItem key={model.id} value={model.name} className="text-slate-200">
                                            {model.name} ({model.provider})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-slate-500">This model will be pre-selected in the wizard</p>
                        </div>

                        {/* Default Tone */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="defaultTone" className="text-slate-300">Default Tone</Label>
                                <span className="text-sm text-purple-400 font-medium">
                                    {defaultTone < 33 ? "Casual" : defaultTone > 66 ? "Academic" : "Professional"}
                                </span>
                            </div>
                            <Slider
                                id="defaultTone"
                                value={[defaultTone]}
                                onValueChange={([value]) => setDefaultTone(value)}
                                min={0}
                                max={100}
                                step={1}
                                className="cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-slate-500">
                                <span>Casual</span>
                                <span>Professional</span>
                                <span>Academic</span>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter>
                        <Button
                            onClick={handleSavePreferences}
                            disabled={isSavingPrefs}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        >
                            {isSavingPrefs ? "Saving..." : "Save Preferences"}
                        </Button>
                    </CardFooter>
                </Card>

                {/* Card 3: Data & Privacy (Danger Zone) */}
                <Card className="bg-slate-900/50 border-red-900/50">
                    <CardHeader>
                        <CardTitle className="text-red-400">Data & Privacy</CardTitle>
                        <CardDescription>Manage your personal data</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* Export Data */}
                        <div className="flex items-center justify-between p-4 bg-red-950/20 border border-red-900/30 rounded-lg">
                            <div className="flex-1">
                                <h4 className="font-medium text-slate-200 mb-1">Export Personal Data</h4>
                                <p className="text-sm text-slate-400">
                                    Download all your prompts and templates as JSON
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                onClick={handleExportData}
                                disabled={isExporting}
                                className="border-slate-700 text-slate-300 hover:bg-slate-800"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                {isExporting ? "Exporting..." : "Export"}
                            </Button>
                        </div>

                        {/* Delete Account */}
                        <div className="flex items-center justify-between p-4 bg-red-950/20 border border-red-900/30 rounded-lg">
                            <div className="flex-1">
                                <h4 className="font-medium text-red-400 mb-1">Delete Account</h4>
                                <p className="text-sm text-slate-400">
                                    Permanently delete your account and all data
                                </p>
                            </div>
                            <Button
                                variant="destructive"
                                onClick={() => setShowDeleteDialog(true)}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="bg-slate-900 border-slate-800">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-slate-200">Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                            This action cannot be undone. This will permanently delete your
                            account and remove all your data from our servers, including:
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>All saved prompts</li>
                                <li>All templates</li>
                                <li>Your settings and preferences</li>
                            </ul>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-slate-700 text-slate-300">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? "Deleting..." : "Delete Account"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
