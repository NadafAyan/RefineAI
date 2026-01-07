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
    getDoc,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { PromptTemplate, TemplatesHook } from "@/types/template";

export function useTemplates(): TemplatesHook {
    const { user } = useAuth();
    const [templates, setTemplates] = useState<PromptTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setTemplates([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        // Reference to user's templates collection
        const templatesRef = collection(db, "users", user.uid, "templates");
        const q = query(templatesRef, orderBy("createdAt", "desc"));

        // Set up real-time listener
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const templatesData: PromptTemplate[] = [];
                snapshot.forEach((doc) => {
                    templatesData.push({
                        id: doc.id,
                        ...doc.data(),
                    } as PromptTemplate);
                });
                setTemplates(templatesData);
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching templates:", err);
                setError(err.message);
                setLoading(false);
            }
        );

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, [user]);

    const saveTemplate = async (
        template: Omit<PromptTemplate, "id" | "userId" | "createdAt">
    ): Promise<void> => {
        if (!user) throw new Error("User not authenticated");

        try {
            const templatesRef = collection(db, "users", user.uid, "templates");
            await addDoc(templatesRef, {
                ...template,
                userId: user.uid,
                createdAt: serverTimestamp(),
            });
        } catch (err) {
            console.error("Error saving template:", err);
            throw err;
        }
    };

    const deleteTemplate = async (templateId: string): Promise<void> => {
        if (!user) throw new Error("User not authenticated");

        try {
            const templateRef = doc(db, "users", user.uid, "templates", templateId);
            await deleteDoc(templateRef);
        } catch (err) {
            console.error("Error deleting template:", err);
            throw err;
        }
    };

    const fetchTemplateById = async (templateId: string): Promise<PromptTemplate | null> => {
        if (!user) throw new Error("User not authenticated");

        try {
            const templateRef = doc(db, "users", user.uid, "templates", templateId);
            const templateSnap = await getDoc(templateRef);

            if (templateSnap.exists()) {
                return {
                    id: templateSnap.id,
                    ...templateSnap.data(),
                } as PromptTemplate;
            }
            return null;
        } catch (err) {
            console.error("Error fetching template:", err);
            throw err;
        }
    };

    return {
        templates,
        loading,
        error,
        saveTemplate,
        deleteTemplate,
        fetchTemplateById,
    };
}
