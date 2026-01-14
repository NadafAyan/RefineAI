"use client";


import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, ArrowRight, Copy, Play, Sparkles, Check, ChevronsUpDown, Bookmark, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useTemplates } from "@/hooks/useTemplates";
import { usePromptHistory } from "@/hooks/usePromptHistory";

export default function DashboardPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-slate-300 text-lg">Loading...</div>
            </div>
        }>
            <DashboardContent />
        </Suspense>
    );
}

function DashboardContent() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const {
        currentStep,
        state,
        isGenerating,
        nextStep,
        prevStep,
        selectCategory,
        updateField,
        getPersonaSuggestions,
        getPlaceholderText,
        generatePrompt,
        loadFromParams,
        loadFromTemplate,
        loadFromId,
        resetWizard,
        hasConfigChanged,
    } = usePromptWizard();

    const { saveTemplate, fetchTemplateById } = useTemplates();
    const { savePrompt } = usePromptHistory();

    const [modelSearchOpen, setModelSearchOpen] = useState(false);
    const [prevStepValue, setPrevStepValue] = useState(1);
    const [showTemplateDialog, setShowTemplateDialog] = useState(false);
    const [templateName, setTemplateName] = useState("");
    const [templateDescription, setTemplateDescription] = useState("");
    const [showTestRunDialog, setShowTestRunDialog] = useState(false);
    const [testRunOutput, setTestRunOutput] = useState("");
    const [isTestRunning, setIsTestRunning] = useState(false);
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    // ... rest of the component logic ...

    // Load from URL parameters for remix functionality
    useEffect(() => {
        if (searchParams && searchParams.get('category')) {
            loadFromParams(searchParams);
        }
    }, [searchParams, loadFromParams]);

    // Load from template if templateId is in URL
    useEffect(() => {
        const templateId = searchParams?.get('templateId');
        if (templateId) {
            fetchTemplateById(templateId)
                .then((template) => {
                    if (template) {
                        loadFromTemplate(template);
                        toast.success(`Template "${template.name}" loaded!`);
                    } else {
                        toast.error("Template not found");
                    }
                })
                .catch((error) => {
                    console.error("Error loading template:", error);
                    toast.error("Failed to load template");
                });
        }
    }, [searchParams, fetchTemplateById, loadFromTemplate]);

    // Load from remixId if in URL (ID-based approach)
    useEffect(() => {
        const remixId = searchParams?.get('remixId');
        if (remixId) {
            loadFromId(remixId);
        }
    }, [searchParams, loadFromId]);

    useEffect(() => {
        setPrevStepValue(currentStep);
    }, [currentStep]);

    // Auto-generate and auto-save when reaching step 4


    const handleCopy = async () => {
        await navigator.clipboard.writeText(state.refinedOutput);
        toast.success("Copied to clipboard!");
    };

    const handleSaveTemplate = () => {
        setShowTemplateDialog(true);
    };

    const handleSaveTemplateConfirm = async () => {
        if (!templateName.trim()) {
            toast.error("Template name is required");
            return;
        }

        if (!state.selectedCategory) {
            toast.error("Please complete the wizard first");
            return;
        }

        try {
            await saveTemplate({
                name: templateName,
                description: templateDescription,
                category: state.selectedCategory.id,
                persona: state.persona,
                constraints: {
                    model: state.targetModel?.name || '',
                    format: state.format,
                    tone: state.tone,
                },
            });

            toast.success(`Template "${templateName}" saved successfully!`);
            setShowTemplateDialog(false);
            setTemplateName('');
            setTemplateDescription('');
        } catch (error) {
            console.error("Error saving template:", error);
            toast.error("Failed to save template");
        }
    };

    // Auto-save to history after generating prompt
    const handleGeneratePrompt = useCallback(async () => {
        try {
            await generatePrompt();

            // Automatically save to history after successful generation
            if (state.selectedCategory && state.objective && state.refinedOutput) {
                await savePrompt({
                    category: state.selectedCategory.id,
                    objective: state.objective,
                    persona: state.persona,
                    targetModel: state.targetModel?.name || '',
                    format: state.format,
                    tone: state.tone,
                    refinedOutput: state.refinedOutput,
                });
                toast.success("Prompt saved to history!");
            }
        } catch (error) {
            console.error("Error generating or saving prompt:", error);
            toast.error("Failed to generate prompt");
        }
    }, [generatePrompt, state.selectedCategory, state.objective, state.refinedOutput, state.persona, state.targetModel, state.format, state.tone, savePrompt]);

    // Auto-generate and auto-save when reaching step 4
    useEffect(() => {
        const autoGenerateAndSave = async () => {
            if (currentStep === 4 && !state.refinedOutput && state.selectedCategory && state.objective && state.persona) {
                await handleGeneratePrompt();
            }
        };
        autoGenerateAndSave();
    }, [currentStep, state.selectedCategory, state.objective, state.persona, state.refinedOutput, handleGeneratePrompt]);

    const handleTestRun = async () => {
        if (!state.refinedOutput || !state.objective) {
            toast.error("Please generate a prompt first");
            return;
        }

        // Check if it's an image generation request
        const isImageGen = state.selectedCategory?.id === 'image-generation' ||
            state.objective.toLowerCase().includes('image') ||
            state.objective.toLowerCase().includes('picture') ||
            state.objective.toLowerCase().includes('photo');

        if (isImageGen) {
            toast.info("Image generation test runs are not supported yet");
            return;
        }

        setTestRunOutput("");
        setShowTestRunDialog(true);
        setIsTestRunning(true);

        try {
            const response = await fetch('/api/test-run', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: state.refinedOutput,
                    objective: state.objective,
                }),
            });

            if (!response.ok) {
                throw new Error('Test run failed');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                throw new Error('No response stream');
            }

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                setTestRunOutput((prev) => prev + chunk);
            }

            toast.success("Test run completed!");
        } catch (error: unknown) {
            console.error("Test run error:", error);
            toast.error("Test run failed. Please try again.");
            setTestRunOutput((prev) => prev + "\n\n[Error: Test run failed]");
        } finally {
            setIsTestRunning(false);
        }
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
                                    Share your raw thoughts. Don&apos;t worry about structure - we&apos;ll refine it later.
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
                                {/* Regenerate Button - Shows when config changes */}
                                {hasConfigChanged && (
                                    <Button
                                        onClick={handleGeneratePrompt}
                                        disabled={isGenerating}
                                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/50"
                                    >
                                        <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                                        {isGenerating ? 'Regenerating...' : 'Regenerate Prompt'}
                                    </Button>
                                )}

                                <Button
                                    onClick={handleCopy}
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/50"
                                >
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy to Clipboard
                                </Button>
                                <Button
                                    onClick={handleSaveTemplate}
                                    variant="outline"
                                    className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
                                >
                                    <Bookmark className="w-4 h-4 mr-2" />
                                    Save as Template
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

            {/* Save Template Dialog */}
            <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
                <DialogContent className="bg-slate-900 border-slate-800">
                    <DialogHeader>
                        <DialogTitle className="text-slate-200">Save this Configuration</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Save your persona and settings to reuse with different tasks
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="template-name" className="text-slate-300">Template Name *</Label>
                            <Input
                                id="template-name"
                                placeholder="e.g., Python Debugger"
                                value={templateName}
                                onChange={(e) => setTemplateName(e.target.value)}
                                className="mt-1 bg-slate-800 border-slate-700 text-slate-200"
                            />
                        </div>

                        <div>
                            <Label htmlFor="template-description" className="text-slate-300">Description (Optional)</Label>
                            <Textarea
                                id="template-description"
                                placeholder="Add notes about when to use this template..."
                                value={templateDescription}
                                onChange={(e) => setTemplateDescription(e.target.value)}
                                className="mt-1 bg-slate-800 border-slate-700 text-slate-200 min-h-[80px]"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowTemplateDialog(false)}
                            className="border-slate-700 text-slate-300"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveTemplateConfirm}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                        >
                            Save Template
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Test Run Dialog */}
            <Dialog open={showTestRunDialog} onOpenChange={setShowTestRunDialog}>
                <DialogContent className="bg-slate-900 border-slate-800 max-w-3xl max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle className="text-slate-200 flex items-center gap-2">
                            <Play className="w-5 h-5 text-purple-400" />
                            Test Run Output
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Real-time AI response using your generated prompt
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Output Display */}
                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 max-h-96 overflow-y-auto">
                            {isTestRunning && testRunOutput.length === 0 ? (
                                <div className="flex items-center gap-3 text-slate-400">
                                    <div className="animate-spin">
                                        <Sparkles className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <span>Generating response...</span>
                                </div>
                            ) : (
                                <pre className="text-slate-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                                    {testRunOutput || 'No output yet...'}
                                    {isTestRunning && <span className="animate-pulse">▊</span>}
                                </pre>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between text-sm text-slate-500">
                            <span>
                                {testRunOutput.length} characters
                            </span>
                            <span>
                                {isTestRunning ? (
                                    <span className="text-purple-400 flex items-center gap-2">
                                        <span className="animate-pulse">●</span>
                                        Streaming...
                                    </span>
                                ) : (
                                    <span className="text-green-400">✓ Complete</span>
                                )}
                            </span>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowTestRunDialog(false)}
                            className="border-slate-700 text-slate-300"
                        >
                            Close
                        </Button>
                        <Button
                            onClick={() => {
                                navigator.clipboard.writeText(testRunOutput);
                                toast.success("Output copied to clipboard!");
                            }}
                            disabled={!testRunOutput}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Output
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
