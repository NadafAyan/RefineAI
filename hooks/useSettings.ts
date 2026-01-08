"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { deleteUser } from "firebase/auth";
import { UserSettings, SettingsHook } from "@/types/settings";
import { toast } from "sonner";

export function useSettings(): SettingsHook {
    const { user } = useAuth();
    const [settings, setSettings] = useState<UserSettings | null>(null);
    const [loading, setLoading] = useState(true);

    // Load settings on mount
    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const loadSettings = async () => {
            try {
                const settingsRef = doc(db, "users", user.uid, "settings", "preferences");
                const settingsDoc = await getDoc(settingsRef);

                if (settingsDoc.exists()) {
                    setSettings(settingsDoc.data() as UserSettings);
                } else {
                    // Create default settings
                    const defaultSettings: UserSettings = {
                        userId: user.uid,
                        updatedAt: serverTimestamp() as any,
                        defaultModel: "GPT-4o",
                        defaultTone: 50,
                        theme: "dark",
                    };
                    await setDoc(settingsRef, defaultSettings);
                    setSettings(defaultSettings);
                }
            } catch (error) {
                console.error("Error loading settings:", error);
                toast.error("Failed to load settings");
            } finally {
                setLoading(false);
            }
        };

        loadSettings();
    }, [user]);

    const updateSettings = async (data: Partial<Omit<UserSettings, 'userId' | 'updatedAt'>>) => {
        if (!user) {
            toast.error("Please sign in to update settings");
            return;
        }

        try {
            const settingsRef = doc(db, "users", user.uid, "settings", "preferences");
            const updateData = {
                ...data,
                updatedAt: serverTimestamp(),
            };

            await setDoc(settingsRef, updateData, { merge: true });

            // Update local state
            setSettings((prev) => prev ? { ...prev, ...data } as UserSettings : null);

            toast.success("Settings updated successfully!");
        } catch (error) {
            console.error("Error updating settings:", error);
            toast.error("Failed to update settings");
            throw error;
        }
    };

    const exportUserData = async () => {
        if (!user) {
            toast.error("Please sign in to export data");
            return {};
        }

        try {
            // Fetch all user data
            const promptsRef = collection(db, "users", user.uid, "prompts");
            const templatesRef = collection(db, "users", user.uid, "templates");
            const settingsRef = doc(db, "users", user.uid, "settings", "preferences");

            const [promptsSnapshot, templatesSnapshot, settingsDoc] = await Promise.all([
                getDocs(promptsRef),
                getDocs(templatesRef),
                getDoc(settingsRef),
            ]);

            const prompts = promptsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const templates = templatesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const settingsData = settingsDoc.exists() ? settingsDoc.data() : null;

            const exportData = {
                user: {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                },
                settings: settingsData,
                prompts,
                templates,
                exportedAt: new Date().toISOString(),
            };

            return exportData;
        } catch (error) {
            console.error("Error exporting data:", error);
            toast.error("Failed to export data");
            throw error;
        }
    };

    const deleteAccount = async () => {
        if (!user) {
            toast.error("Please sign in to delete account");
            return;
        }

        try {
            // Delete all user data from Firestore
            const promptsRef = collection(db, "users", user.uid, "prompts");
            const templatesRef = collection(db, "users", user.uid, "templates");
            const settingsRef = doc(db, "users", user.uid, "settings", "preferences");

            const [promptsSnapshot, templatesSnapshot] = await Promise.all([
                getDocs(promptsRef),
                getDocs(templatesRef),
            ]);

            // Delete all prompts
            const deletePromises = promptsSnapshot.docs.map(doc => deleteDoc(doc.ref));
            // Delete all templates
            deletePromises.push(...templatesSnapshot.docs.map(doc => deleteDoc(doc.ref)));
            // Delete settings
            deletePromises.push(deleteDoc(settingsRef));

            await Promise.all(deletePromises);

            // Delete Firebase Auth account
            await deleteUser(user);

            toast.success("Account deleted successfully");
        } catch (error) {
            console.error("Error deleting account:", error);
            toast.error("Failed to delete account. Please try again.");
            throw error;
        }
    };

    return {
        settings,
        loading,
        updateSettings,
        exportUserData,
        deleteAccount,
    };
}
