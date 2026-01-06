"use client";

import { useEffect, useState } from "react";
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    deleteDoc,
    doc,
    addDoc,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { SavedPrompt, PromptHistoryHook } from "@/types/prompt";

export function usePromptHistory(): PromptHistoryHook {
    const { user } = useAuth();
    const [prompts, setPrompts] = useState<SavedPrompt[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setPrompts([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        // Reference to user's prompts collection
        const promptsRef = collection(db, "users", user.uid, "prompts");
        const q = query(promptsRef, orderBy("createdAt", "desc"));

        // Set up real-time listener
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const promptsData: SavedPrompt[] = [];
                snapshot.forEach((doc) => {
                    promptsData.push({
                        id: doc.id,
                        ...doc.data(),
                    } as SavedPrompt);
                });
                setPrompts(promptsData);
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching prompts:", err);
                setError(err.message);
                setLoading(false);
            }
        );

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, [user]);

    const deletePrompt = async (promptId: string): Promise<void> => {
        if (!user) throw new Error("User not authenticated");

        try {
            const promptRef = doc(db, "users", user.uid, "prompts", promptId);
            await deleteDoc(promptRef);
        } catch (err) {
            console.error("Error deleting prompt:", err);
            throw err;
        }
    };

    const savePrompt = async (
        prompt: Omit<SavedPrompt, "id" | "userId" | "createdAt">
    ): Promise<void> => {
        if (!user) throw new Error("User not authenticated");

        try {
            const promptsRef = collection(db, "users", user.uid, "prompts");
            await addDoc(promptsRef, {
                ...prompt,
                userId: user.uid,
                createdAt: serverTimestamp(),
            });
        } catch (err) {
            console.error("Error saving prompt:", err);
            throw err;
        }
    };

    return {
        prompts,
        loading,
        error,
        deletePrompt,
        savePrompt,
    };
}
