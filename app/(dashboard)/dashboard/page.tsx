"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { usePromptWizard } from "@/hooks/usePromptWizard";
import { CATEGORIES, ALL_MODELS, FORMAT_OPTIONS, Model } from "@/lib/wizard-data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Copy, Save, Play, Sparkles, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const {
        currentStep,
        state,
        nextStep,
        prevStep,
        selectCategory,
        updateField,
        getPersonaSuggestions,
        getPlaceholderText,
        resetWizard,
    } = usePromptWizard();

    const [modelSearchOpen, setModelSearchOpen] = useState(false);
    const [prevStepValue, setPrevStepValue] = useState(1);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    useEffect(() => {
        setPrevStepValue(currentStep);
    }, [currentStep]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(state.refinedOutput);
    };

    const handleSave = () => {
        console.log("Saving to history:", state);
    };

    const handleTestRun = () => {
        console.log("Test run:", state);
    };

    const progressPercentage = (currentStep / 4) * 100;

    const getStepLabel = () => {
        switch (currentStep) {
            case 1: return "Define Intent";
            case 2: return "Brain Dump";
            case 3: return "Choose Persona";
            case 4: return "Configure Output";
            default: return "";
        }
    };

    const personaSuggestions = getPersonaSuggestions();
    const placeholderText = getPlaceholderText();

    // Animation direction based on step change
    const direction = currentStep > prevStepValue ? 1 : -1;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-slate-300 text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        Prompt Wizard
                    </h1>
                    <p className="text-slate-400 mt-2">
                        Smart branching workflow for perfect prompts
                    </p>
                </div>
                {currentStep > 1 && (
                    <Button
                        variant="outline"
                        onClick={resetWizard}
                        className="border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                        Start Over
                    </Button>
                )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">
                        Step {currentStep} of 4: <span className="text-purple-400 font-medium">{getStepLabel()}</span>
                    </span>
                    <span className="text-purple-400 font-medium">{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
            </div>

            {/* Wizard Steps */}
            <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                    key={currentStep}
                    custom={direction}
                    initial={{ opacity: 0, x: direction * 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction * -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    {/* Step 1: Category Selection */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <Card className="bg-slate-900/50 border-purple-500/50 shadow-lg shadow-purple-500/20">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-purple-300 flex items-center gap-2">
                                        <Sparkles className="w-6 h-6" />
                                        Step 1: Define Your Intent
                                    </CardTitle>
                                    <CardDescription className="text-slate-400 text-base">
                                        What kind of help do you need? Choose a category to get started.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {CATEGORIES.map((category) => {
                                            const Icon = category.icon;
                                            const isSelected = state.selectedCategory?.id === category.id;

                                            return (
                                                <button
                                                    key={category.id}
                                                    onClick={() => selectCategory(category)}
                                                    className={cn(
                                                        "p-6 rounded-lg border-2 transition-all text-left hover:scale-105",
                                                        isSelected
                                                            ? "border-purple-500 bg-gradient-to-br from-purple-500/20 to-blue-500/20 shadow-lg shadow-purple-500/30"
                                                            : "border-slate-700 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/50"
                                                    )}
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className={cn(
                                                            "p-3 rounded-lg",
                                                            isSelected ? "bg-purple-500/20" : "bg-slate-700/50"
                                                        )}>
                                                            <Icon className={cn(
                                                                "w-6 h-6",
                                                                isSelected ? "text-purple-400" : "text-slate-400"
                                                            )} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className={cn(
                                                                "font-semibold mb-1",
                                                                isSelected ? "text-purple-300" : "text-slate-300"
                                                            )}>
                                                                {category.label}
                                                            </h3>
                                                            <p className="text-sm text-slate-500">
                                                                {category.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Step 2: Brain Dump */}
                    {currentStep === 2 && (
                        <Card className="bg-slate-900/50 border-purple-500/50 shadow-lg shadow-purple-500/20">
                            <CardHeader>
                                <CardTitle className="text-2xl text-purple-300 flex items-center gap-2">
                                    <Sparkles className="w-6 h-6" />
                                    Step 2: Brain Dump
                                </CardTitle>
                                <CardDescription className="text-slate-400 text-base">
                                    Share your raw thoughts. Don't worry about structure - we'll refine it later.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="objective" className="text-slate-300 text-base">
                                        Your Objective
                                        {state.selectedCategory && (
                                            <span className="ml-2 text-xs text-purple-400">
                                                ({state.selectedCategory.label})
                                            </span>
                                        )}
                                    </Label>
                                    <Textarea
                                        id="objective"
                                        placeholder={placeholderText}
                                        value={state.objective}
                                        onChange={(e) => updateField("objective", e.target.value)}
                                        className="min-h-[200px] bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-purple-500"
                                    />
                                    <p className="text-xs text-slate-500">
                                        Be as raw and messy as you like. We will structure it later.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 3: Persona Selection */}
                    {currentStep === 3 && (
                        <Card className="bg-slate-900/50 border-purple-500/50 shadow-lg shadow-purple-500/20">
                            <CardHeader>
                                <CardTitle className="text-2xl text-purple-300 flex items-center gap-2">
                                    <Sparkles className="w-6 h-6" />
                                    Step 3: Choose Your AI Persona
                                </CardTitle>
                                <CardDescription className="text-slate-400 text-base">
                                    Who should the AI act as? Pick a suggestion or create your own.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="persona" className="text-slate-300 text-base">
                                        AI Persona
                                    </Label>
                                    <Input
                                        id="persona"
                                        placeholder="e.g., Senior Python Developer with 10 years of experience..."
                                        value={state.persona}
                                        onChange={(e) => updateField("persona", e.target.value)}
                                        className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-purple-500"
                                    />
                                </div>

                                {personaSuggestions.length > 0 && (
                                    <div className="space-y-3">
                                        <Label className="text-slate-300 text-sm">
                                            Recommended for{" "}
                                            <span className="text-purple-400">
                                                {state.selectedCategory?.label}
                                            </span>
                                        </Label>
                                        <div className="flex flex-wrap gap-2">
                                            {personaSuggestions.map((suggestion) => (
                                                <Badge
                                                    key={suggestion}
                                                    variant="outline"
                                                    onClick={() => updateField("persona", suggestion)}
                                                    className={cn(
                                                        "cursor-pointer transition-all hover:scale-105",
                                                        state.persona === suggestion
                                                            ? "border-purple-500 bg-purple-500/20 text-purple-300"
                                                            : "border-slate-600 hover:border-purple-500 hover:bg-purple-500/10"
                                                    )}
                                                >
                                                    {suggestion}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 4: Constraints & Review */}
                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <Card className="bg-slate-900/50 border-purple-500/50 shadow-lg shadow-purple-500/20">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-purple-300 flex items-center gap-2">
                                        <Sparkles className="w-6 h-6" />
                                        Step 4: Configure Output
                                    </CardTitle>
                                    <CardDescription className="text-slate-400 text-base">
                                        Fine-tune your prompt parameters
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                    {/* Target Model - Searchable Combobox */}
                                    <div className="space-y-3">
                                        <Label className="text-slate-300 text-base">
                                            Target Model
                                        </Label>
                                        <Popover open={modelSearchOpen} onOpenChange={setModelSearchOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={modelSearchOpen}
                                                    className="w-full justify-between bg-slate-800/50 border-slate-700 text-slate-200 hover:bg-slate-800"
                                                >
                                                    {state.targetModel
                                                        ? `${state.targetModel.name} (${state.targetModel.provider})`
                                                        : "Select model..."}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0 bg-slate-800 border-slate-700">
                                                <Command className="bg-slate-800">
                                                    <CommandInput
                                                        placeholder="Search models..."
                                                        className="border-slate-700"
                                                    />
                                                    <CommandEmpty>No model found.</CommandEmpty>
                                                    {Object.entries(
                                                        ALL_MODELS.reduce((acc, model) => {
                                                            if (!acc[model.provider]) acc[model.provider] = [];
                                                            acc[model.provider].push(model);
                                                            return acc;
                                                        }, {} as Record<string, Model[]>)
                                                    ).map(([provider, models]) => (
                                                        <CommandGroup key={provider} heading={provider}>
                                                            {models.map((model) => (
                                                                <CommandItem
                                                                    key={model.id}
                                                                    value={`${model.name} ${model.provider}`}
                                                                    onSelect={() => {
                                                                        updateField("targetModel", model);
                                                                        setModelSearchOpen(false);
                                                                    }}
                                                                    className="text-slate-300"
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            state.targetModel?.id === model.id
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {model.name}
                                                                    <span className="ml-auto text-xs text-slate-500">
                                                                        {model.type}
                                                                    </span>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    ))}
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    {/* Output Format */}
                                    <div className="space-y-3">
                                        <Label htmlFor="format" className="text-slate-300 text-base">
                                            Output Format
                                        </Label>
                                        <Select
                                            value={state.format}
                                            onValueChange={(value) => updateField("format", value as typeof state.format)}
                                        >
                                            <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-800 border-slate-700">
                                                {FORMAT_OPTIONS.map((format) => (
                                                    <SelectItem key={format} value={format}>
                                                        {format}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Tone Slider */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="tone" className="text-slate-300 text-base">
                                                Communication Tone
                                            </Label>
                                            <span className="text-sm text-purple-400 font-medium">
                                                {state.tone < 33 ? "Casual" : state.tone > 66 ? "Academic/Strict" : "Professional"}
                                            </span>
                                        </div>
                                        <Slider
                                            id="tone"
                                            min={0}
                                            max={100}
                                            step={1}
                                            value={[state.tone]}
                                            onValueChange={(value) => updateField("tone", value[0])}
                                            className="cursor-pointer"
                                        />
                                        <div className="flex items-center justify-between text-xs text-slate-500">
                                            <span>Casual (0)</span>
                                            <span>Professional (50)</span>
                                            <span>Academic/Strict (100)</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Review Section */}
                            <Card className="bg-slate-900/50 border-purple-500/50 shadow-lg shadow-purple-500/20">
                                <CardHeader>
                                    <CardTitle className="text-xl text-purple-300">Refined Prompt Preview</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* Original Input */}
                                        <div className="space-y-3">
                                            <h3 className="text-lg font-semibold text-slate-300">Your Input</h3>
                                            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-3">
                                                <div>
                                                    <p className="text-xs text-slate-500 uppercase">Category</p>
                                                    <p className="text-slate-300 text-sm mt-1">
                                                        {state.selectedCategory?.label || "Not specified"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500 uppercase">Objective</p>
                                                    <p className="text-slate-300 text-sm mt-1 line-clamp-3">
                                                        {state.objective || "Not specified"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500 uppercase">Persona</p>
                                                    <p className="text-slate-300 text-sm mt-1">
                                                        {state.persona || "Not specified"}
                                                    </p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <p className="text-xs text-slate-500 uppercase">Model</p>
                                                        <p className="text-slate-300 text-sm mt-1">
                                                            {state.targetModel?.name}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-500 uppercase">Format</p>
                                                        <p className="text-slate-300 text-sm mt-1">{state.format}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Refined Output */}
                                        <div className="space-y-3">
                                            <h3 className="text-lg font-semibold text-purple-300">Refined Prompt</h3>
                                            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/50 rounded-lg p-4 max-h-[400px] overflow-y-auto">
                                                <pre className="text-slate-300 text-xs whitespace-pre-wrap font-mono leading-relaxed">
                                                    {state.refinedOutput}
                                                </pre>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3">
                                <Button
                                    onClick={handleCopy}
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/50"
                                >
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy to Clipboard
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    variant="outline"
                                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save to History
                                </Button>
                                <Button
                                    onClick={handleTestRun}
                                    variant="outline"
                                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                                >
                                    <Play className="w-4 h-4 mr-2" />
                                    Test Run
                                </Button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                <Button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    variant="ghost"
                    className="text-slate-400 hover:text-white disabled:opacity-30"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>

                {currentStep < 4 && (
                    <Button
                        onClick={nextStep}
                        disabled={
                            (currentStep === 1 && !state.selectedCategory) ||
                            (currentStep === 2 && !state.objective) ||
                            (currentStep === 3 && !state.persona)
                        }
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next Step
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                )}
            </div>
        </div>
    );
}
