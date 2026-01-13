"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { SavedPrompt } from "@/types/prompt";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Copy, MoreVertical, Trash2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface HistoryCardProps {
    prompt: SavedPrompt;
    onDelete: (id: string) => Promise<void>;
}

// Category color mapping
const categoryColors: Record<string, string> = {
    coding: "bg-blue-500/20 text-blue-400 border-blue-500/50",
    work: "bg-orange-500/20 text-orange-400 border-orange-500/50",
    school: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
    creative: "bg-purple-500/20 text-purple-400 border-purple-500/50",
    fun: "bg-pink-500/20 text-pink-400 border-pink-500/50",
    therapy: "bg-green-500/20 text-green-400 border-green-500/50",
    consulting: "bg-indigo-500/20 text-indigo-400 border-indigo-500/50",
    medical: "bg-red-500/20 text-red-400 border-red-500/50",
    art: "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/50",
};

export function HistoryCard({ prompt, onDelete }: HistoryCardProps) {
    const router = useRouter();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isCopying, setIsCopying] = useState(false);

    const handleCopy = async () => {
        setIsCopying(true);
        try {
            await navigator.clipboard.writeText(prompt.refinedOutput);
            // Could add toast notification here
            setTimeout(() => setIsCopying(false), 2000);
        } catch (error) {
            console.error("Failed to copy:", error);
            setIsCopying(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await onDelete(prompt.id);
            setShowDeleteDialog(false);
        } catch (error) {
            console.error("Failed to delete:", error);
            setIsDeleting(false);
        }
    };



    const handleRemix = () => {
        // ID-based approach - more efficient and cleaner URLs
        router.push(`/dashboard?remixId=${prompt.id}`);
    };

    const categoryColor = categoryColors[prompt.category.toLowerCase()] || categoryColors.coding;
    const createdAt = prompt.createdAt?.toDate?.() || new Date();

    return (
        <>
            <Card className="bg-slate-900/50 border-slate-800 hover:border-purple-500/50 transition-all group">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-semibold text-slate-200 line-clamp-2 flex-1">
                            {prompt.objective}
                        </h3>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <MoreVertical className="h-4 w-4 text-slate-400" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                                <DropdownMenuItem
                                    onClick={() => setShowDeleteDialog(true)}
                                    className="text-red-400 focus:text-red-300 focus:bg-red-500/20"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                        <Badge
                            variant="outline"
                            className={cn("border font-medium", categoryColor)}
                        >
                            {prompt.category}
                        </Badge>
                        <Badge
                            variant="outline"
                            className="border-slate-600 text-slate-400"
                        >
                            {prompt.targetModel}
                        </Badge>
                    </div>

                    {/* Refined Output Preview */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                        <pre className="text-xs text-slate-400 font-mono line-clamp-3 whitespace-pre-wrap">
                            {prompt.refinedOutput}
                        </pre>
                    </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <span className="text-xs text-slate-500">
                        Created {formatDistanceToNow(createdAt, { addSuffix: true })}
                    </span>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCopy}
                            disabled={isCopying}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleRemix}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                        >
                            <Sparkles className="h-4 w-4 mr-1" />
                            Remix
                        </Button>
                    </div>
                </CardFooter>
            </Card>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="bg-slate-900 border-slate-800">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-slate-200">Delete Prompt?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                            This action cannot be undone. This will permanently delete this prompt from your history.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
