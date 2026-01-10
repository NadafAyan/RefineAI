import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { siteConfig } from "@/config/site";
import { ArrowRight, CheckCircle2, XCircle, Play, Target, History, Sparkles, Sliders } from "lucide-react";
import Image from "next/image";

// Icon mapping for features
const iconMap: Record<string, any> = {
    Target: Target,
    History: History,
    Sparkles: Sparkles,
    Sliders: Sliders,
    Play: Play,
};

export default function MarketingPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-transparent pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
            </div>

            {/* --- HERO SECTION --- */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-5xl mx-auto text-center space-y-8">
                        {/* Pill Badge */}
                        <div className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-sm text-purple-300 mb-4 backdrop-blur-sm">
                            <Sparkles className="mr-2 h-3.5 w-3.5" />
                            <span>The New Standard for Prompt Engineering</span>
                        </div>

                        {/* Main Headline */}
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight text-white">
                            {siteConfig.hero.title}
                        </h1>

                        {/* Subtitle */}
                        <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                            {siteConfig.hero.subtitle}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                            <Link href={siteConfig.hero.ctaLink}>
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-7 text-lg font-semibold shadow-xl shadow-purple-500/20 rounded-full transition-all hover:scale-105"
                                >
                                    {siteConfig.hero.cta}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="#how-it-works">
                                <Button
                                    size="lg"
                                    variant="ghost"
                                    className="text-slate-300 hover:text-white hover:bg-white/5 px-8 py-7 text-lg rounded-full"
                                >
                                    See How It Works
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PROBLEM VS SOLUTION --- */}
            <section className="py-24 bg-slate-900/40 relative border-y border-white/5">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        {/* The Problem */}
                        <Card className="bg-red-500/5 border-red-500/20 relative overflow-hidden group hover:bg-red-500/10 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <XCircle className="w-24 h-24 text-red-500" />
                            </div>
                            <CardHeader>
                                <div className="text-red-400 font-semibold tracking-wider uppercase text-sm mb-2">The Old Way</div>
                                <CardTitle className="text-3xl text-white">{siteConfig.problemSolution.problem.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-400 mb-6 text-lg">
                                    {siteConfig.problemSolution.problem.description}
                                </p>
                                <ul className="space-y-4">
                                    {siteConfig.problemSolution.problem.points.map((point, i) => (
                                        <li key={i} className="flex items-start text-slate-300">
                                            <XCircle className="w-5 h-5 text-red-500 mr-3 mt-1 shrink-0" />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* The Solution */}
                        <Card className="bg-emerald-500/5 border-emerald-500/20 relative overflow-hidden group hover:bg-emerald-500/10 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <CheckCircle2 className="w-24 h-24 text-emerald-500" />
                            </div>
                            <CardHeader>
                                <div className="text-emerald-400 font-semibold tracking-wider uppercase text-sm mb-2">The RefineAI Way</div>
                                <CardTitle className="text-3xl text-white">{siteConfig.problemSolution.solution.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-400 mb-6 text-lg">
                                    {siteConfig.problemSolution.solution.description}
                                </p>
                                <ul className="space-y-4">
                                    {siteConfig.problemSolution.solution.points.map((point, i) => (
                                        <li key={i} className="flex items-start text-slate-300">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-3 mt-1 shrink-0" />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* --- FEATURES GRID --- */}
            <section id="features" className="py-24 relative">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 mb-4">
                            Built for Power Users
                        </h2>
                        <p className="text-lg text-slate-400">
                            Everything you need to master Large Language Models.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {siteConfig.features.map((feature, i) => {
                            const Icon = iconMap[feature.icon] || Sparkles;
                            return (
                                <Card key={i} className="bg-slate-900/50 border-slate-800 hover:border-purple-500/50 transition-all hover:bg-slate-800/80 group">
                                    <CardHeader>
                                        <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                                            <Icon className="w-6 h-6 text-purple-400" />
                                        </div>
                                        <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-slate-400 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* --- PROCESS STEPS --- */}
            <section id="how-it-works" className="py-24 bg-slate-900/30 border-y border-white/5">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {siteConfig.process.map((step, i) => (
                            <div key={i} className="relative">
                                {/* Connector Line */}
                                {i !== siteConfig.process.length - 1 && (
                                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-[2px] bg-gradient-to-r from-purple-500/50 to-transparent z-0" />
                                )}

                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <div className="w-16 h-16 rounded-full bg-slate-950 border border-purple-500/50 flex items-center justify-center text-2xl font-bold text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)] mb-6">
                                        {i + 1}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{step.title.split('. ')[1]}</h3>
                                    <p className="text-slate-400 leading-relaxed px-4">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FAQ SECTION --- */}
            <section className="py-24">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
                        <p className="text-slate-400">Why RefineAI helps you build better software.</p>
                    </div>

                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {siteConfig.faq.map((item, i) => (
                            <AccordionItem key={i} value={`item-${i}`} className="border border-slate-800 rounded-lg px-6 bg-slate-900/30">
                                <AccordionTrigger className="text-lg text-slate-200 hover:text-purple-400 hover:no-underline py-6">
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-400 text-lg leading-relaxed pb-6">
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>

            {/* --- FOOTER CTA --- */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                        Ready to Refine Your Workflow?
                    </h2>
                    <Link href="/login">
                        <Button
                            size="lg"
                            className="bg-white text-purple-900 hover:bg-slate-100 px-10 py-8 text-xl font-bold rounded-full shadow-2xl transition-all hover:scale-105"
                        >
                            Get Started for Free
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
