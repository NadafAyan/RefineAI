"use client";

import { useState, useMemo } from "react";
import { useTemplates } from "@/hooks/useTemplates";
import { TemplateCard } from "@/components/template-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, BookmarkPlus, Sparkles } from "lucide-react";
import { CATEGORIES } from "@/lib/wizard-data";

export default function TemplatesPage() {

    const { templates, loading, error, deleteTemplate } = useTemplates();
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");

    // Filter templates based on search and category
    const filteredTemplates = useMemo(() => {
        return templates.filter((template) => {
            const matchesSearch =
                template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                template.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                template.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                template.persona.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory =
                categoryFilter === "all" ||
                template.category.toLowerCase() === categoryFilter.toLowerCase();

            return matchesSearch && matchesCategory;
        });
    }, [templates, searchQuery, categoryFilter]);

    return (
        <div className="space-y-8">
            {/* Enhanced Header with Gradient Background */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/30 via-slate-900/50 to-blue-900/30 border border-purple-500/20 p-8 shadow-xl shadow-purple-500/10">
                {/* Decorative gradient orbs */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl -z-10" />

                <div className="flex items-start justify-between gap-6 mb-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30">
                                <BookmarkPlus className="w-8 h-8 text-purple-400" />
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                                    Saved Templates
                                </h1>
                                <p className="text-slate-400 mt-1 text-lg">
                                    {loading ? (
                                        "Loading your templates..."
                                    ) : (
                                        <>
                                            <span className="text-purple-400 font-semibold">{templates.length}</span> saved template{templates.length !== 1 ? 's' : ''}
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>
                        <p className="text-slate-300 max-w-2xl leading-relaxed">
                            Reuse your perfect prompt configurations. Click <span className="text-purple-400 font-medium">Use Template</span> to pre-fill the wizard with your saved settings and type a fresh objective.
                        </p>
                    </div>

                </div>

                {/* Search and Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                        <Input
                            placeholder="Search by name, description, or persona..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 h-12 bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl"
                        />
                    </div>

                    {/* Category Filter */}
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-full sm:w-[220px] h-12 bg-slate-800/50 border-slate-700 text-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="all">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-purple-400" />
                                    All Categories
                                </div>
                            </SelectItem>
                            {CATEGORIES.map((category) => {
                                const Icon = category.icon;
                                return (
                                    <SelectItem key={category.id} value={category.id}>
                                        <div className="flex items-center gap-2">
                                            <Icon className="w-4 h-4 text-slate-400" />
                                            {category.label}
                                        </div>
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/20 rounded-lg">
                            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-red-400 font-medium">Error loading templates: {error}</p>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="space-y-4 animate-pulse">
                            <div className="h-64 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/50" />
                        </div>
                    ))}
                </div>
            )}

            {/* Enhanced Empty State */}
            {!loading && filteredTemplates.length === 0 && !error && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="relative mb-8">
                        {/* Animated gradient ring */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-2xl opacity-20 animate-pulse" />
                        <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-2 border-dashed border-slate-700 rounded-full p-12 backdrop-blur-sm">
                            <BookmarkPlus className="w-20 h-20 text-slate-500" />
                        </div>
                    </div>

                    <h3 className="text-3xl font-bold text-slate-200 mb-3">
                        {searchQuery || categoryFilter !== "all"
                            ? "No templates found"
                            : "No templates saved yet"}
                    </h3>

                    <p className="text-slate-400 mb-8 max-w-md text-lg leading-relaxed">
                        {searchQuery || categoryFilter !== "all" ? (
                            <>
                                Try adjusting your <span className="text-purple-400">search</span> or{" "}
                                <span className="text-blue-400">filter</span> criteria
                            </>
                        ) : (
                            <>
                                Save your perfect prompt configurations from the wizard to reuse them with different objectives
                            </>
                        )}
                    </p>


                    <p className="text-sm text-slate-500 mt-4">
                        Use the wizard to create prompts, then save them as templates with the &quot;Save as Template&quot; button
                    </p>
                </div>
            )}

            {/* Templates Grid */}
            {!loading && filteredTemplates.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-slate-300">
                            {filteredTemplates.length === templates.length ? (
                                `All Templates`
                            ) : (
                                <>
                                    Showing <span className="text-purple-400">{filteredTemplates.length}</span> of{" "}
                                    <span className="text-slate-400">{templates.length}</span>
                                </>
                            )}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTemplates.map((template) => (
                            <TemplateCard
                                key={template.id}
                                template={template}
                                onDelete={deleteTemplate}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
